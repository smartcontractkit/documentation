---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Getting Support"
permalink: "docs/getting-help/"
---
### Where do I go to get help and support? 

If you run into issues and the available documentation, videos, and code repositories are not able to assist you, the best way to get help is to follow the support escalation process in this document. Sometimes you might have a question that is too theoretical or hasn't been solved, so you might not always get what you're looking for!

## 1. Double check the documentation

Check to see if you missed any code, documentation, blog, or video on the topic or issue you're looking for. There are typically a few different resources on a topic if one doesn't answer exactly what you're looking for. You can also use the documentation search bar to look up things as well. 

## 2. Do a web search for the specific error or situation you're in. 

Often someone else has asked the same question that you're asking. If you copy and paste the error into the Google or web search bar, there is a good chance that you will find some helpful material from someone else who has already found the solution to your question.

## 3. Open an issue on the github or code repository

This is only applicable if you're working with a certain set of code. For example, if you're having an issue working with the [Chainlink Hardhat Starter kit](https://github.com/smartcontractkit/hardhat-starter-kit), open an issue on the repo explaining exactly what's going on and someone might have the answer that you need.

When writing issues, remember to:
- Keep titles short
- Remain clear and concise
- Format your message ([using 3 backticks](https://discuss.codecademy.com/t/using-backticks-to-format-your-code/3697) will help format your code)
- Always add any and all associated code
- Please don't use screenshots, those *generally* make it harder!

## 4. Ask a question on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink) or [Stack Exchange Ethereum](https://ethereum.stackexchange.com/)

This is where the majority of people will end up, and is one of the most helpful resources out there. Stack Overflow is meant to be living documentation, so please do your best to make a [thoughtful, easy to triage question](https://stackoverflow.com/help/how-to-ask). This will make it much easier for people to help debug your issue, and make sure it doesn't get removed from the site. Remember, we want to make this question **searchable** so others who run into the same issue can also get their question solved. You could use really any forum based site you like if you prefer another site over Stack Overflow. 

Here is an example of a not-so-well-formatted question:

> Title: Please help
> I'm following this guide, and my code is breaking, what's going on? 
> https://docs.chain.link/
> Here is my code
> pragma solidity 0.6.7; contract HelloWorld { string public message; constructor(string memory initialMessage) {message = initialMessage; }

Here is that same question, formatted much better:

> Title: Remix Solidity Compile Error - Source File Requires Different Compiler Version
> I'm [following this guide](https://docs.chain.link/docs/beginners-tutorial/), and I'm unable to compile my solidity code in [Remix](https://remix.ethereum.org/). 
> Here is the code:
> ```javascript
> pragma solidity 0.6.7;
>
> contract HelloWorld {
>    string public message;
>
>    constructor(string memory initialMessage) {
>        message = initialMessage;
>    }
>
>    function updateMessage(string memory newMessage) public {
>        message = newMessage;
>    }
>}
>```
>
> And the error I'm getting is as follows:
> 
> ```
> ParserError: Source file requires different compiler version (current compiler is 0.8.7+commit.e28d00a7.Emscripten.clang) - note that nightly builds are considered to be strictly less than the released version
> --> contracts/test.sol:1:1:
> |
> 1 | pragma solidity 0.6.7;
> | ^^^^^^^^^^^^^^^^^^^^^^
> 
> ```

It's often recommended to come up with a [minimum reproducible example](https://stackoverflow.com/help/minimal-reproducible-example) to help others understand your issue. This way, they can help you get an answer quickly. Remember, its a community run platform!

Don't get discouraged if your question gets downvoted or removed, this just means you need to format your question a little differently next time!

## 5. Ask the community 

And lastly, you can always just in the [discord](https://discord.gg/2YHSAey) and see if there is a community member who might be able to help you out. One of the best ways to ask the community, is to drop a link to your stackoverflow question, issue, or forum where you're asking a Chainlink question. Remember, these are community members, and they are helping because they are wonderful kind individuals!
