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
  <secret-dialog-help
    title="About VMware vSphere Secrets"
    color="indigo darken-4"
    backgroundSrc="/static/background_vsphere.svg"
    :value="value"
    @input="onInput"
  >
    <template v-slot:help-content>
      <div class="help-content">
        <p>
          Before you can provision and access a Kubernetes cluster on VMware vSphere, you need to add vSphere and NSX-T account credentials.
          The Gardener needs these credentials to provision and operate the VMware vSphere infrastructure for your Kubernetes cluster.
        </p>
        <p>
          Ensure that these accounts have privileges to <b>create, modify and delete VMs and Networking resources</b>.
        </p>
        <p>
          Please read the
          <a href="https://docs.vmware.com/de/VMware-vSphere/index.html"
            target="_blank"
            class="indigo--text text--darken-4">
            VMware vSphere Documentation</a>
            and the
          <a href="https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html"
            target="_blank"
            class="indigo--text text--darken-4">
          VMware NSX-T Data Center Documentation</a>.
        </p>
      </div>
    </template>
  </secret-dialog-help>
</template>

<script>
import SecretDialogHelp from '@/components/dialogs/SecretDialogHelp'

export default {
  components: {
    SecretDialogHelp
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onInput (value) {
      this.$emit('input', value)
    }
  }
}
</script>
