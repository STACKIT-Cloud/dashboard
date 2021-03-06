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
  <v-app>
    <v-content>
      <v-container fluid class="fill-height align-stretch">
        <v-row>
          <v-col cols="5" class="d-flex flex-column">
            <div class="flex-grow-1">
              <img src="../assets/logo-beta.svg" class="logo">
              <h1>Kubernetes Engine</h1>
            </div>
          </v-col>
          <v-col cols="7" class="d-flex flex-column">
              <div class="flex-shrink-1 primary--text">
                <h1>Enterprise-Grade Kubernetes Service</h1>
                <h2>Serving for your purpose!</h2>
              </div>
              <div v-if="landingPageUrl" class="flex-shrink-1 hint">
                <span>Discover what our service is about at the</span>
                <a :href="landingPageUrl" target="_blank">Gardener Landing Page <v-icon size="20">mdi-open-in-new</v-icon></a>
              </div>
              <div class="flex-grow-1 actions">
                <div class="loginButton secondary elevation-1 primary--text" @click.stop="handleLogin(primaryLoginType)">
                  Login <v-icon class="ml-1 primary--text">mdi-login-variant</v-icon>
                </div>
                <template v-if="showTokenLoginLink">
                  <div class="loginLink">
                    <a @click.stop="handleLogin('token')">Login with Bearer Token</a>
                  </div>
                </template>
              </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <vue-snotify></vue-snotify>
    <v-dialog v-model="dialog" persistent max-width="480px">
      <v-card>
        <v-card-title class="primary">
          <span class="headline white--text">Login</span>
        </v-card-title>
        <v-card-text class="primary--text">
          <v-text-field
            ref="token"
            v-model="token"
            :append-icon="showToken ? 'visibility' : 'visibility_off'"
            :type="showToken ? 'text' : 'password'"
            outline
            label="Token"
            hint="Enter a bearer token trusted by the Kubernetes API server"
            persistent-hint
            @click:append="showToken = !showToken"
            required>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text color="primary" @click="submitToken">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { SnotifyPosition } from 'vue-snotify'
import get from 'lodash/get'
import { setDelayedInputFocus } from '@/utils'

export default {
  data () {
    return {
      dialog: false,
      showToken: false,
      token: ''
    }
  },
  computed: {
    ...mapState([
      'color',
      'cfg',
      'user'
    ]),
    redirectPath () {
      return get(this.$route.query, 'redirectPath', '/')
    },
    primaryLoginType () {
      return this.cfg.primaryLoginType || 'oidc'
    },
    showTokenLoginLink () {
      return this.primaryLoginType === 'oidc'
    },
    landingPageUrl () {
      return this.cfg.landingPageUrl
    },
    footerLogoUrl () {
      return this.cfg.footerLogoUrl || '/static/sap-logo.svg'
    },
    drawerWidth () {
      return Math.floor(this.windowSize.width * 0.4)
    }
  },
  beforeRouteEnter (to, from, next) {
    let err
    if (/^#.+/.test(to.hash)) {
      const searchParams = new URLSearchParams(to.hash.substring(1))
      if (searchParams.has('error')) {
        err = new Error(searchParams.get('error'))
      }
    }
    next(vm => {
      if (err) {
        vm.showSnotifyLoginError(err.message)
        vm.$router.replace('/login')
      }
    })
  },
  methods: {
    ...mapActions([
      'unsetUser'
    ]),
    handleLogin (loginType) {
      if (loginType === 'token') {
        this.dialog = true
        setDelayedInputFocus(this, 'token')
      } else {
        try {
          this.$userManager.signinWithOidc(this.redirectPath)
        } catch (err) {
          this.showSnotifyLoginError(err.message)
        }
      }
    },
    closeDialog () {
      this.dialog = false
      this.token = undefined
    },
    async submitToken () {
      try {
        const token = this.token
        this.token = undefined
        await this.$userManager.signinWithToken(token)
        this.dialog = false
        await this.$router.push(this.redirectPath)
      } catch (err) {
        if (err === undefined) {
          // If router.push is done in any beforeEach navigation hook, the initial navigation is aborted with err = undefined. We do this in ensureDataLoaded to navigate to the ShootList as default. This should not result in an error.
          return
        }
        this.dialog = false
        this.showSnotifyLoginError(err.message)
      }
    },
    showSnotifyLoginError (message) {
      const config = {
        position: SnotifyPosition.rightBottom,
        timeout: 5000,
        showProgressBar: false
      }
      this.$snotify.error(message, 'Login Error', config)
    }
  }
}
</script>

<style lang="scss" scoped>

$bg1: #24232c;
$bg2: #504e5a;

$font1: #ffffff;
$font2: #958071;

$hexArea: lighten(#D8D7DA,9);
$hexOutline: darken($hexArea,1);

#app {
  main {
    .container {
      padding: 0;
      .row {
        margin: 0;
        .col:nth-child(1) {
          background-color: #004E5A;
          padding: 0;

          .logo {
            height: 6vw;
            pointer-events: none;
            display: block;
            margin: auto;
            margin-top: 150px;
          }

          h1 {
            font-size: 3vw;
            font-weight: 200;
            width: 100%;
            text-align: center;
            color: $font1;
            letter-spacing: 5px;
          }

          h2 {
            font-size: 1.8vw;
            font-weight: 300;
            width: 100%;
            color: #009F76;
            text-align: center;
          }
        }

        .col:nth-child(2) {
          background-color: white;
          padding: 100px 0px 0px 50px;
          background-size: 40px 60px;

          h1 {
            font-size: 2.5vw;
            width: 100%;
            text-align: left;
            font-family: 'Roboto', sans-serif;
            white-space: nowrap;
            font-weight: 400;
          }

          h2 {
            font-size: 1.6vw;
            width: 100%;
            text-align: left;
            font-weight: 400;
          }

          .hint {
            padding-top: 48px;
            font-size: 1.3vw;
            width: 100%;
            text-align: left;
            font-weight: 500;

            a {
              color: #009688;
              padding-left: 10px;
              text-decoration: none;
              &:hover {
                color: #26A69A;
              }
            }

          }

          .actions {
            position: relative;

            .loginButton {
              padding: 10px;
              padding-left: 40px;
              font-size: 20px;
              cursor: pointer;
              bottom: 80px;
              position: absolute;
              right: 0px;
              width: 40%;
            }

            .loginLink {
              padding: 5px;
              padding-left: 10px;
              background-color: transparent;
              font-size: 11px;
              position: absolute;
              right: 0px;
              bottom: 50px;
              width: 40%;

              a {
                color: #cfcfcf;
                &:hover {
                  color: #004E5A;
                }
              }
            }
          }
        }
      }
    }
  }
}

@import '~vue-snotify/styles/material.css';
@import '~vuetify/src/styles/styles.sass';

.snotify-rightTop {
  top: 75px;
}

.snotify-info {
  background-color: map-get($cyan, 'darken-2');
}

.snotify {
  width: 400px;
}

</style>
