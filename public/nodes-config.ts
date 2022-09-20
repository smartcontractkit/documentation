import nodesConfig from './reference/nodesConf.json';
import { Octokit } from 'octokit';
import { createTokenAuth } from '@octokit/auth-token';
import fetch from 'node-fetch';
import { writeFile, readFile } from 'fs/promises';
import { normalize } from 'path';
import { format } from 'prettier';

import * as dotenv from 'dotenv';
dotenv.config();

const getTags = async (repo: string) => {
  const PAT = process.env.PAT;
  if (!PAT) throw new Error('PAT not found in .env');
  const auth = createTokenAuth(PAT);
  const authentication = await auth();
  const octokit = new Octokit({
    auth: authentication.token,
  });
  interface Node {
    tagName: string;
  }

  interface Edge {
    node: Node;
  }

  interface GetTagsResponse {
    repository: {
      releases: {
        edges: Edge[];
      };
    };
  }

  const response = (await octokit.graphql(`{
    repository(name: "${nodesConfig.repo}", owner: "${nodesConfig.owner}") {
      releases(last: 100) {
        edges {
          node {
            tagName
          }
        }
      }
    }
  }`)) as GetTagsResponse;

  return response.repository.releases.edges.map((edge) => edge.node.tagName);
};

const filterTags = (tags: string[]) => {
  const currentTags = nodesConfig['current-tags'] as string[];
  // Test to follow this pattern: v0.8.1 , v0.8.11 , v0.11.12...Etc
  const pattern = new RegExp(/^v\d{1,2}\.\d{1,2}\.\d{1,2}$/);

  return tags.filter((tag) => pattern.test(tag) && currentTags.indexOf(tag) === -1);
};

const sortTags = (tags: string[]) => {
  return tags.sort((t1, t2) => {
    // remove v
    const tag1 = t1.slice(1),
      tag2 = t2.slice(1);
    const version1 = tag1.split('.').map((x) => parseInt(x));
    const version2 = tag2.split('.').map((x) => parseInt(x));
    if (version1.length !== version2.length) throw new Error(`cannot sort tags ${t1},${t2}`);
    for (let i = 0; i < version1.length; i++) {
      if (version1[i] < version2[i]) {
        return -1;
      } else if (version1[i] > version2[i]) {
        return 1;
      }
    }
    return 0;
  });
};

const updateIndex = async (tags: { tagName: string; path: string }[]) => {
  if (tags.length === 0) return;
  const path = normalize(`./docs/chainlink-nodes/config/index.md`);
  let data = (await readFile(path)).toString();

  for (const tag of tags) {
    const entry = `- [${tag.tagName}](${tag.path})`;
    data = data.replace('**Topics**', `**Topics**\n${entry}`);
  }

  await writeFile(
    path,
    format(data, {
      parser: 'markdown',
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 120,
    }),
    {
      flag: 'w',
    }
  );
};

const updateTags = async (tags: { tagName: string; path: string }[]) => {
  if (tags.length === 0) return;
  for (const tag of tags) {
    (nodesConfig['current-tags'] as string[]).push(tag.tagName);
  }

  const nodesConfigPath = normalize('./_src/reference/nodesConf.json');
  await writeFile(
    nodesConfigPath,
    format(JSON.stringify(nodesConfig), {
      parser: 'json',
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 120,
    }),
    {
      flag: 'w',
    }
  );
};

const writeConfigFile = async (tagName: string) => {
  const patternTagInFile = '__TAG__';
  const fileHeader = `
---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Configuring Chainlink Nodes"
permalink: "docs/chainlink-nodes/config/${patternTagInFile}/"
---
`;

  const tagInPath = tagName.replace(/\./g, '_');
  const clean = [
    {
      from: ':warning:',
      to: '⚠️',
    },
  ];
  const path = normalize(`./docs/chainlink-nodes/config/${tagInPath}.md`);
  const url = normalize(
    `https://raw.githubusercontent.com/${nodesConfig.owner}/${nodesConfig.repo}/${tagName}/${nodesConfig.path}`
  );
  const response = await fetch(url);
  if (response.status === 200) {
    let data = await (await fetch(url)).text();
    for (const key in clean) {
      data = data.replace(new RegExp(clean[key].from, 'g'), clean[key].to);
    }
    const content = fileHeader.replace(patternTagInFile, tagInPath) + data;

    await writeFile(
      path,
      format(content, {
        parser: 'markdown',
        semi: true,
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 120,
      }),
      {
        flag: 'w',
      }
    );

    return { tagName, path: `/docs/chainlink-nodes/config/${tagInPath}/` };
  } else if (response.status !== 404) {
    throw new Error(`couldn't fetch ${url}. status ${response.status}`);
  }
  return { tagName: '', path: '' };
};

const writeConfigFiles = async (tags: string[]) => {
  interface Result {
    success: { tagName: string; path: string }[];
    error: {
      tag: string;
      errorMessage: any;
    }[];
  }
  const result: Result = { success: [], error: [] };
  for (const tag of tags) {
    try {
      const successTag = await writeConfigFile(tag);
      if (successTag.tagName) result.success.push(successTag);
    } catch (error) {
      result.error.push({ tag, errorMessage: error });
    }
  }
  return result;
};
getTags(nodesConfig.repo).then(async (w) => {
  const sortedTags = sortTags(filterTags(w));
  const result = await writeConfigFiles(sortedTags);
  console.log(`config files generated ${JSON.stringify(result)}`);
  await updateIndex(result.success);
  await updateTags(result.success);
  if (result.error.length > 0) throw new Error(`an error happened ${JSON.stringify(result.error)}`);
});
