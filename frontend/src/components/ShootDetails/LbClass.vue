<!--
Copyright (c) 2020 by SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the LICENSE file

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
  <g-popper
    :title="name"
    toolbarColor="primary"
    :popperKey="`lbclass_${name}`"
  >
    <template v-slot:popperRef>
      <v-chip small class="cursor-pointer mr-2" outlined color="primary">{{name}}</v-chip>
    </template>
    <span class="font-weight-bold">Floating Subnet ID:</span>&nbsp;{{floatingSubnetID}}
  </g-popper>
</template>

<script>

import GPopper from '@/components/GPopper'

export default {
  name: 'lb-class',
  components: {
    GPopper
  },
  props: {
    name: {
      type: String
    },
    floatingSubnetID: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .cursor-pointer ::v-deep .v-chip__content {
    cursor: pointer;
  }
</style>
