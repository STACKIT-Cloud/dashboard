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

const { Resources } = require('../kubernetes-client')

async function hasAuthorization (user, { resourceAttributes, nonResourceAttributes }) {
  if (!user) {
    return false
  }
  const client = user.client
  const { apiVersion, kind } = Resources.SelfSubjectAccessReview
  const body = {
    kind,
    apiVersion,
    spec: {
      resourceAttributes,
      nonResourceAttributes
    }
  }
  const {
    status: {
      allowed = false
    } = {}
  } = await client['authorization.k8s.io'].selfsubjectaccessreviews.create(body)
  return allowed
}

exports.isAdmin = function (user) {
  // if someone is allowed to get secrets in all namespaces he is considered to be an administrator
  return hasAuthorization(user, {
    resourceAttributes: {
      verb: 'get',
      group: '',
      resource: 'secrets'
    }
  })
}

exports.isBIM = function (user) {
  // if someone is allowed to get all projects he is considered to be an bim
  return hasAuthorization(user, {
    resourceAttributes: {
      verb: 'list',
      group: 'core.gardener.cloud',
      resource: 'projects'
    }
  })
}

exports.canGetOpenAPI = function (user) {
  return hasAuthorization(user, {
    nonResourceAttributes: {
      verb: 'get',
      path: '/openapi/v2'
    }
  })
}

exports.canGetShoot = function (user, namespace, name) {
  return hasAuthorization(user, {
    resourceAttributes: {
      verb: 'get',
      group: 'core.gardener.cloud',
      resource: 'shoots',
      namespace,
      name
    }
  })
}

/*
SelfSubjectRulesReview should only be used to hide/show actions or views on the UI and not for authorization checks.
*/
exports.selfSubjectRulesReview = async function (user, namespace) {
  if (!user) {
    return false
  }
  const client = user.client
  const { apiVersion, kind } = Resources.SelfSubjectRulesReview
  const body = {
    kind,
    apiVersion,
    spec: {
      namespace
    }
  }
  const {
    status: {
      resourceRules,
      nonResourceRules,
      incomplete,
      evaluationError
    } = {}
  } = await client['authorization.k8s.io'].selfsubjectrulesreviews.create(body)
  return { resourceRules, nonResourceRules, incomplete, evaluationError }
}
