import * as cdk from '@aws-cdk/core';
import { Group, ManagedPolicy, User } from '@aws-cdk/aws-iam';

const admins = 'AdminGroup';
const adminUsers = [
    'admin01',
];

const developers = 'DevGroup';
const devUsers = [
    'developer01',
    'developer02'
];

export class SimpleIamUserManagementStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // AWS managed policy
        const adminPolicy = ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess');
        const powerUserPolicy = ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess');

        // Admin group
        const adminGroup = new Group(this, admins, { groupName: admins });
        adminGroup.addManagedPolicy(adminPolicy);
        const adminPassword = '{Replace Valid Password for Admin}';
        // Admin User
        adminUsers.forEach(admin => {
            new User(this, admin, {
                userName: admin,
                groups: [adminGroup],
                password: cdk.SecretValue.plainText(adminPassword),
                passwordResetRequired: true
            })
        })

        // Developer group
        const devGroup = new Group(this, developers, { groupName: developers });
        devGroup.addManagedPolicy(powerUserPolicy);
        const devPassword = '{Replace Valid Password for Developer}';

        // Developer User
        devUsers.forEach(devUser => {
            new User(this, devUser, {
                userName: devUser,
                groups: [devGroup],
                password: cdk.SecretValue.plainText(devPassword),
                passwordResetRequired: true
            })
        })

    }
}
