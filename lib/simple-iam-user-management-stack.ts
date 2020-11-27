import * as cdk from '@aws-cdk/core';
import { Group, ManagedPolicy, User } from '@aws-cdk/aws-iam';
import * as password from './password_generator';

const admins = 'AdminGroup';
const adminUsers = [
    'admin_01',
    'admin_02',
    'admin_03'
];

const developers = 'DevGroup';

export class SimpleIamUserManagementStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // AWS managed policy
        const adminPolicy = ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess');
        const powerUserPolicy = ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess');

        // Admin group
        const adminGroup = new Group(this, admins, { groupName: admins });
        adminGroup.addManagedPolicy(adminPolicy);
        let adminPassword = "";
        // For Admin
        {
            const c = new password.composite_password_generator();
            c.add(new password.digit_generator(4));
            c.add(new password.lower_letter_generator(3));
            c.add(new password.symbol_generator(3));
            c.add(new password.upper_letter_generator(3));
            adminPassword = c.generate();
        }

        // Admin User
        adminUsers.forEach(admin => {
            new User(this, admin, {
                userName: admin,
                groups: [adminGroup],
                password: cdk.SecretValue.plainText(adminPassword),
                //passwordResetRequired: true // パスワードジェネレータなら不要？
            })
        })


        // Developer group
        const devGroup = new Group(this, developers, { groupName: developers });
        devGroup.addManagedPolicy(powerUserPolicy);
        let devPassword: string = "";

        // For Developer's Password
        {
            const c = new password.composite_password_generator();
            c.add(new password.digit_generator(3));
            c.add(new password.lower_letter_generator(3));
            c.add(new password.symbol_generator(3));
            c.add(new password.upper_letter_generator(3));
            devPassword = c.generate();
        }

        const numOfUser = 100;
        for (let n = 0; n < numOfUser; n++) {
            const user = "user_" + ('000' + n).slice(-3);
            // console.log(`User_${ret}`);
            // devPassword = generator(); // 例のパスワードジェネレータ
            new User(this, user, {
                userName: user,
                groups: [devGroup],
                password: cdk.SecretValue.plainText(devPassword),
                //passwordResetRequired: true // パスワードジェネレータなら不要？
            });
        }

        // Output Admin Password
        new cdk.CfnOutput(this, "adminPassword", {
            value: adminPassword
        });

        // Output Developer Password
        new cdk.CfnOutput(this, "devPassword", {
            value: devPassword
        });
    }
}
