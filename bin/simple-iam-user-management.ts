#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SimpleIamUserManagementStack } from '../lib/simple-iam-user-management-stack';

const app = new cdk.App();
new SimpleIamUserManagementStack(app, 'SimpleIamUserManagementStack');
