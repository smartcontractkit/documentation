// copied from https://github.com/balancer-labs/balancer-v2-monorepo/blob/master/pvt/helpers/src/test/expectEvent.ts
import { expect } from 'chai';
import { BigNumber, ContractReceipt } from 'ethers';
import { Interface, LogDescription } from 'ethers/lib/utils';

// Ported from @openzeppelin/test-helpers to use with Ethers. The Test Helpers don't
// yet have Typescript typings, so we're being lax about them here.
// See https://github.com/OpenZeppelin/openzeppelin-test-helpers/issues/122

/* eslint-disable @typescript-eslint/no-explicit-any */

export function inReceipt(receipt: ContractReceipt, eventName: string, eventArgs = {}): any {
  if (receipt.events == undefined) {
    throw new Error('No events found in receipt');
  }

  const events = receipt.events.filter((e) => e.event === eventName);
  expect(events.length > 0).to.equal(true, `No '${eventName}' events found`);

  const exceptions: Array<string> = [];
  const event = events.find(function (e) {
    for (const [k, v] of Object.entries(eventArgs)) {
      try {
        if (e.args == undefined) {
          throw new Error('Event has no arguments');
        }

        contains(e.args, k, v);
      } catch (error: any) {
        exceptions.push(error);
        return false;
      }
    }
    return true;
  });

  if (event === undefined) {
    // Each event entry may have failed to match for different reasons,
    // throw the first one
    throw exceptions[0];
  }

  return event;
}

export function inIndirectReceipt(
  receipt: ContractReceipt,
  emitter: Interface,
  eventName: string,
  eventArgs = {},
  address?: string
): any {
  const decodedEvents = receipt.logs
    .filter((log) => (address ? log.address.toLowerCase() === address.toLowerCase() : true))
    .map((log) => {
      try {
        return emitter.parseLog(log);
      } catch {
        return undefined;
      }
    })
    .filter((e): e is LogDescription => e !== undefined);

  const expectedEvents = decodedEvents.filter((event) => event.name === eventName);
  expect(expectedEvents.length > 0).to.equal(true, `No '${eventName}' events found`);

  const exceptions: Array<string> = [];
  const event = expectedEvents.find(function (e) {
    for (const [k, v] of Object.entries(eventArgs)) {
      try {
        if (e.args == undefined) {
          throw new Error('Event has no arguments');
        }

        contains(e.args, k, v);
      } catch (error: any) {
        exceptions.push(error);
        return false;
      }
    }
    return true;
  });

  if (event === undefined) {
    // Each event entry may have failed to match for different reasons,
    // throw the first one
    throw exceptions[0];
  }

  return event;
}

export function notEmitted(receipt: ContractReceipt, eventName: string): void {
  if (receipt.events != undefined) {
    const events = receipt.events.filter((e) => e.event === eventName);
    expect(events.length > 0).to.equal(false, `'${eventName}' event found`);
  }
}

function contains(args: { [key: string]: any | undefined }, key: string, value: any) {
  expect(key in args).to.equal(true, `Event argument '${key}' not found`);

  if (value === null) {
    expect(args[key]).to.equal(null, `expected event argument '${key}' to be null but got ${args[key]}`);
  } else if (BigNumber.isBigNumber(args[key]) || BigNumber.isBigNumber(value)) {
    const actual = BigNumber.isBigNumber(args[key]) ? args[key].toString() : args[key];
    const expected = BigNumber.isBigNumber(value) ? value.toString() : value;

    expect(args[key]).to.equal(value, `expected event argument '${key}' to have value ${expected} but got ${actual}`);
  } else {
    expect(args[key]).to.be.deep.equal(
      value,
      `expected event argument '${key}' to have value ${value} but got ${args[key]}`
    );
  }
}
