---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Contributing to Chainlink"
permalink: "docs/contributing-to-chainlink/"
---
Chainlink is an open-source project licensed [under the MIT license](https://github.com/smartcontractkit/chainlink/blob/master/LICENSE), and we encourage contributions from all developers and community members.

<p>
https://www.youtube.com/watch?v=nerpcSPN4kE
<p>

# What It Means to Contribute
When you contribute to the Chainlink project, you as a developer or community member contribute your time and effort to help improve and grow Chainlink. Your contribution can be from various methods:
- [Building and maintaining the Chainlink software and tools](#contributing-to-software-and-tooling)
- [Improving and maintaining the documentation, including translations into other languages](#contributing-to-the-documentation)
- [Creating Chainlink focused content (blog posts, tutorials, videos etc)](#creating-community-content)
- [Becoming a developer expert](#becoming-a-developer-expert)
- [Becoming a community advocate](#joining-the-chainlink-community-advocate-program)
- [Running a Chainlink focused developer Bootcamp (in person or online)](#running-a-chainlink-focused-developer-bootcamp)
- [Running an in-person meetup or watch party](#running-an-in-person-meetup-or-watch-party)
- [Participate in a hackathon](#participate-in-a-hackathon)
- [Applying for a grant](#applying-for-a-grant)

# Why Should You Contribute

[Open source software](https://en.wikipedia.org/wiki/Open-source_software) is a model that brings multiple benefits for both the project and the contributors. As a developer or community member, contributing to Chainlink helps you to gain valuable skills and experience, improve the software that you use, and grow your personal brand in the community which can lead to future employment opportunities. On top of these awesome things, contributing to open source is fun.  It can give you a sense of community involvement, and gives you a personal sense of satisfaction knowing that you're part of an effort to build something that will enable a fairer, more transparent, and efficient new world.

# Ways to Contribute

## Contributing to Software and Tooling
The most direct way you can contribute to Chainlink is to contribute to the core code or the various tooling found in our [GitHub repository](https://github.com/smartcontractkit/). Contributing to code or code-based tools can generally be split into a few different categories:
- Raising an issue
- Requesting a new feature
- Submitting a Pull Request (PR) for a fix, improvement, or new tool


### Raising an Issue
During the course of using Chainlink software or tools, you might encounter errors or unexpected behavior that leads you to believe the software isn't behaving correctly. You can bring this to the attention of the Chainlink Labs team as well as the wider developer community by raising an issue in the project’s GitHub repository. The 'Issues' tab lists all of the open issues for the repository.

After an issue is raised and tagged, the Chainlink Labs team and the wider community can address it. This gives the issue the visibility required for someone to investigate it and resolve the issue.

When you first create an issue, you must also categorize it. This prefixes the issue name to give viewers an indication of what category the issue relates to:
- [NODE]: The issue relates to the core node software
- [DEVEL]: The issue is a result of working on code found in the current repository
- [FEAT]: The issue relates to a new feature request
- [SMRT]: The issue related to using Chainlink smart contracts
- [EXPL]: The issue related to using the Chainlink Explorer
- [FAUC]: The issue related to using the Chainlink Faucet

![Selecting the new issue category](/files/new-issue-category.png)

After you select a category, enter the details for the issue. Include as much detail about the issue as possible. Provide a thorough description, environment, and software version details. Also provide detailed steps that describe how to reproduce the issue. The more thorough you make your description, the better the chances are that someone will be able to pick up the issue and resolve it.

Once a team member acknowledges that the issue has been received, they will tag it with an appropriate label. You should then monitor the state of the open issue for any questions or updates.


### Requesting a new Feature
Have you thought of an improvement or an awesome new feature that you think should be implemented into Chainlink? Request a new feature to bring it to the attention of the team and the wider community. You can request new features by creating a new GitHub issue in the correct repository and tagging that issue with the [FEAT] prefix (Feature request). The process for doing this is covered in the [Raising an Issue](#raising-an-issue) section. Provide as much detail as possible in your feature request, including any benefits, risks, or considerations that you can think of.

#### Voting on new features

Sometimes a new feature is put to a vote to decide if it's something that the team and wider community should implement. When an feature is put to a vote, the issue is tagged with the 'needs votes' label. You can contribute to the voting process by reacting to the first post in the feature request with a thumbs up or thumbs down emoji. This will help drive the decision. You can also contribute your thoughts by replying directly to the feature request with a new post in the thread.

![Voting on a new feature request](/files/voting-issue.png)

### Submitting a Pull Request

The best way to contribute to Chainlink is to submit a [pull request (PR)](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests). PRs can be submitted for various reasons, such as fixing an identified issue, adding a feature or improvement to the project, or even adding an entirely new repository to the Chainlink source code for a new tool or feature. If you're looking for something to pick up and create a PR for, you can search through the Chainlink repositories to find open issues, and approved feature requests.

If you're new to contributing to open-source software or Chainlink, we've tagged some [good first issues](https://github.com/smartcontractkit/chainlink/issues?q=is%3Aissue+label%3A%22good+first+issue%22) against the main node software and smart contracts that you can tackle. Each major repository in the Chainlink GitHub should also have some good first issues tagged for developers to be able to take on.

All code changes must follow the [style guide] (https://github.com/smartcontractkit/chainlink/wiki/Code-Style-Guide), All PRs must be in an appropriately named branch with a format like 'feat/feature-description' or 'devel/issue-description'. After you submit a PR, you should get a response by a team member within a day or two acknowledging that the PR has been received. After that, monitor the PR for any additional questions or updates that come up while the team and the community review the changes.

## Contributing to the documentation
The [Chainlink documentation](https://docs.chain.link/) is the go-to place for developers who want to learn how to build applications using Chainlink, and node operators wanting useful information on running a Chainlink node. The documentation is [open source](https://github.com/smartcontractkit/documentation), allowing for other developers and community members to contribute to adding or improving it. You can contribute to the Chainlink documentation in various ways:
- Improving the readability of pages
- Fixing typos or grammar errors
- Adding new guides or tutorials that you would find useful
- Translating the documentation into other languages

The process for contributing to the documentation follows the process defined earlier in the [Submitting a Pull Request](#submitting-a-pull-request) section. Each page also has a 'Suggest Edits' link on the top right, and will directly take you to the page in the [documentation repository](https://github.com/smartcontractkit/documentation), where you can create a new PR with the suggested changes. Before you create a PR for the documentation, read the [contributing guidelines](https://github.com/smartcontractkit/documentation/blob/main/CONTRIBUTING.md).

If you want to translate the documentation into a new language that is not yet supported, feel free to [reach out to the team](mailto:devrel@smartcontract.com) beforehand, so we can make sure you get the support you need.


## Creating Community Content
Chainlink has a strong and vibrant community of developers and community advocates. Community members often create Chainlink-focused content in various forms and publish it for the wider community on various platforms. This increases knowledge and awareness of Chainlink solutions across the wider community and builds the contributor's personal skills and brand in the community.

Some examples of the content generated from the community:
- Document your experience in using Chainlink as part of your project
- Do a deep dive blog post or video on a Chainlink solution
- Write up technical tutorials showcasing Chainlink being used in various use cases


## Becoming a Developer Expert
Chainlink Developer Experts are smart contract and blockchain developers with deep experience building applications using Chainlink. They are passionate about sharing their technical knowledge with the world. As a developer expert, you will receive recognition in the community, previews of new Chainlink features, exclusive access to Chainlink events, and opportunities to level up your technical and soft skills. You can apply to become a developer expert on the [Chainlink Developer Experts page](https://chain.link/developers/experts).


## Joining the Chainlink Community Advocate program
The [Chainlink Community Advocate Program](https://blog.chain.link/expanding-the-chainlink-community-advocate-program/) is a program designed to help accelerate the awareness and adoption of Chainlink. Chainlink community advocates are passionate members of the Chainlink community that help to achieve this by running virtual and in-person meetups, connecting with partners and sponsors, creating content, and working directly with the teams that are making Chainlink-powered smart contracts. Many Advocates have gone on to have rewarding careers in the blockchain industry, and some of them work on Chainlink specifically.

To become a community advocate, you can apply via the [community advocates web page](https://chain.link/community/advocates).


## Running a Chainlink Focused Developer Bootcamp
In June 2021, the Chainlink Labs team [virtually hosted](https://blog.chain.link/smart-contract-developer-bootcamp-on-demand/) the first [Chainlink Developer Bootcamp](http://chain.link/bootcamp). If you're passionate about educating others about smart contracts and Chainlink, you can contribute by running your own developer Bootcamp. You can also contribute by translating an existing Bootcamp and running it in another language. Before you run your own Bootcamp, [reach out to the team](mailto:devrel@smartcontract.com) so we can make sure you have the support that you need.

## Running an In-Person Meetup or Watch Party
If you're passionate about helping to grow the awareness and adoption of Chainlink, you can contribute by running an in-person meetup or watch party for a Chainlink event such as [SmartCon](https://www.smartcontractsummit.io/). Meetups are a great way to meet others also passionate about how hybrid smart contracts can create an economically fair world.

If you're interested in running an in-person meetup or watch party, [reach out to the team](mailto:community@smartcontract.com) so we can make sure you have the support that you need.

## Participate in a Hackathon
Chainlink runs hackathons multiple times per year and often sponsors other hackathons across the blockchain ecosystem. Participating in a hackathon that Chainlink is a part of is a great way to learn how to use Chainlink. It is also a great way to showcase your skills to the Chainlink team and the wider community. Hackathons are a popular place for recruiting talent into the blockchain ecosystem.

To stay up to date on the hackathons that Chainlink is running or sponsoring, keep an eye out on the official Chainlink social media channels, and sign up for our [developer newsletter](https://docs.chain.link/docs/developer-communications/).

## Applying for a Grant
The [Chainlink grant program](https://chain.link/community/grants) encourages the community to create critical developer tooling, add high-quality data, and the launch key services around the Chainlink Network. Grant categories include community, integration, bug bounty, research, and social impact grants. If you have a great idea that fits into one of these categories, you can apply for a grant. If successful, you will receive the funding and support needed to successfully build and implement your idea.

For more information about the grant program, go to the [Chainlink Grants web page](https://chain.link/community/grants).
