//
// Reggie
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Shelly Xue Han on 2019-02-12.
//

// import { default as request } from 'supertest'; // eslint-disable-line
import checkArray from '../src/libs/utils';

describe('Test checkArray', () => {
  test('Type of array', () => {
    expect(checkArray('')).toBe(false);
  });

  test('Non-empty array', () => {
    expect(checkArray([])).toBe(false);
  });

  test('Array of object', () => {
    const testObject = { foo: 'foo' };
    expect(checkArray([testObject, testObject])).toBe(true);
  });
});
