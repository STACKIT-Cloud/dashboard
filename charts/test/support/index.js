//
// Copyright (c) 2020 by SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the LICENSE file
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict'

const path = require('path')
const util = require('util')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)
const yaml = require('js-yaml')

process.env.NODE_ENV = 'test'

/*!
 * Attach chai to global
 */
global.chai = require('chai')
global.expect = global.chai.expect

async function helmTemplate (template, pathToValues) {
  const cwd = path.resolve(__dirname, '..', '..', template)
  const cmd = [
    '/usr/local/bin/helm',
    'template',
    '.',
    '--values',
    pathToValues
  ]
  const { stdout } = await exec(cmd.join(' '), { cwd })
  return yaml.safeLoadAll(stdout)
}
global.helmTemplate = helmTemplate
