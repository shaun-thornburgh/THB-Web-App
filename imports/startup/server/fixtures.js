import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';
import { Students, SCHOOL_STUDENT_PERMISSIONS, SCHOOL_STUDENT_STATUS } from '../../api/students/students';

import { UserSchema, ROLES } from '../../api/users/users.js';
import { Roles } from 'meteor/alanning:roles';
//import { Pa}
import faker from 'faker';

function getRandomInt(max) {
    return Math.floor(Math.random() * max) % max;
}
function removeComma(str) {
    return(str.replace(/,/g,''));
}

Meteor.methods({
    'resetDatabase'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }
        console.log("Resetting Database");

        Meteor.users.remove({});
        Schools.rawCollection().drop();
        Students.rawCollection().drop();
    },
    'fixtures.baseData'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }

        Meteor.users.remove({"roles.__global_roles__.0": {$in: [ROLES.ADMIN,ROLES.GOVERNMENTUSER]}});

        let adminObject = {
            username: 'admin',
            email: 'john@chocolatekiwi.com',
            password: 'admin',
            firstName: 'John',
            lastName: 'Malsher'
        };
        console.log("Create User Data");
        let adminId = Accounts.createUser(adminObject);
        Roles.addUsersToRoles( adminId, [ ROLES.ADMIN ], Roles.GLOBAL_GROUP );



        let userObject = {
            username: 'government',
            email: 'user@education.govt.nz',
            password: 'InforMe',
            firstName: 'John',
            lastName: 'Smith'
        };

        console.log("Create Government User Data");
        let userId = Accounts.createUser(userObject);
        Roles.addUsersToRoles( userId, [ ROLES.GOVERNMENTUSER ], Roles.GLOBAL_GROUP );
    },
    'fixtures.governmentuser'()
    {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }

        Meteor.users.remove({"roles.__global_roles__.0": ROLES.ADMIN});


    },
    'fixtures.dumbData'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }


        // Creating Dumb Data For Media, Playlists, Keywords - Should be removed when app launched.
        console.log("fixture.dumbData started: ");

        try {

            let arrSchools = Schools.find({schoolId: {$in: ["1","2","3"]}}).fetch();

            if(!(arrSchools && arrSchools.length > 0))
            {
                console.log("Base Data Not Applied");
                return;
            }
            const student1 = {
                firstName: "John",
                lastName: "Smith",
                email: "johnsmith@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[0]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                    {schoolId: arrSchools[1]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.PENDING}
                ]
            };
            const studentId1 = Students.insert(student1);

            const student2 = {
                firstName: "Michael",
                lastName: "Jackson",
                email: "michaeljackson@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId2 = Students.insert(student2);

            const student3 = {
                firstName: "Michael",
                lastName: "Brown",
                email: "michaelbrown@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId3 = Students.insert(student3);

            const student4 = {
                firstName: "Christano",
                lastName: "Ronaldo",
                email: "ronaldo@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId4 = Students.insert(student4);

            const student5 = {
                firstName: "Ryan",
                lastName: "Giggs",
                email: "ryangiggs@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId5 = Students.insert(student5);

            const student6 = {
                firstName: "Jay",
                lastName: "Leno",
                email: "jayleno@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId6 = Students.insert(student6);

            const student7 = {
                firstName: "Celen",
                lastName: "Dion",
                email: "celendion@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId7 = Students.insert(student7);

            const student8 = {
                firstName: "Bryan",
                lastName: "Adams",
                email: "bryanadams@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId8 = Students.insert(student8);

            const student9 = {
                firstName: "Elvis",
                lastName: "Priesly",
                email: "elvispriesly@gmail.com",
                schoolInfo: [
                    {schoolId: arrSchools[getRandomInt(arrSchools.length)]._id, permissions: [SCHOOL_STUDENT_PERMISSIONS.READ, SCHOOL_STUDENT_PERMISSIONS.WRITE], status:SCHOOL_STUDENT_STATUS.ACTIVE},
                ]
            };
            const studentId9 = Students.insert(student9);
        }catch(err)
        {
            console.log(err);
        }

        console.log("fixture.dumbData finished: ");

    },
    'fixtures.features'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }
        // Creating Dumb Data For Media, Playlists, Keywords - Should be removed when app launched.
        console.log("fixture.features started: ");

        try {

            let features = [
                "Student record administration",
                "Secure chat between users within and between schools",
                "There are many variations of passages of Lorem Ipsum available, but the majority have",
                "Contrary to popular belief, Lorem Ipsum is not simply random text",
                "The generated Lorem Ipsum is therefor",
                "The standard chunk of Lorem"
            ]

            for(let feature of features)
            {
                const featureObj = {
                    title: feature,
                    description: faker.lorem.paragraphs(),
                    creatorName: faker.name.firstName() + " " + faker.name.firstName()
                };
                Features.insert(featureObj);
            }
        }catch(err)
        {
            console.log(err);
        }

        console.log("fixture.features finished: ");

    },
    'fixtures.schools'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }
        console.log("fixtures.schools ");
        const results = Papa.parse( Assets.getText("schools.csv"), {
            header: false});

        console.log("Schools Loaded: " + results.data.length);
        //console.log(results);
        for(var i=0; i<results.data.length; i++)
        {
            var schoolCSV = results.data[i];
            try {
                //if(i == 0)
                //{
                //    console.log(schoolCSV);
                //}
                const schoolObject = {
                    schoolId: schoolCSV[0],
                    name: schoolCSV[1],
                    telephone: schoolCSV[2],
                    fax: schoolCSV[3],
                    email: schoolCSV[4],
                    principal: schoolCSV[5],
                    website: schoolCSV[6],
                    location: {
                        street: schoolCSV[7],
                        suburb: schoolCSV[8],
                        city: schoolCSV[9],
                    },
                    postalAddress:
                    {
                        postalAddress1: schoolCSV[10],
                        postalAddress2: schoolCSV[11],
                        postalAddress3: schoolCSV[12],
                        postalCode: schoolCSV[13],
                        urbanArea: schoolCSV[14],
                    },
                    institutionInformation:
                    {
                        schoolType: schoolCSV[15],
                        definition: schoolCSV[16],
                        authority: schoolCSV[17],
                        genderOfStudents: schoolCSV[18],
                    },
                    regionalInformation:
                    {
                        territorialAuthority: schoolCSV[19],
                        regionalCouncil: schoolCSV[20],
                        ministryOfEducationLocalOffice: schoolCSV[21],
                        educationRegion: schoolCSV[22],
                        generalElectorate: schoolCSV[23],
                        maoriElectorate: schoolCSV[24],
                        censusAreaUnit: schoolCSV[25],
                        ward: schoolCSV[26],
                        communityOfLearning:
                        {
                            id: schoolCSV[27],
                            name: schoolCSV[28],
                        },
                        lnglat: {type: "Point", coordinates: [schoolCSV[29],schoolCSV[30]]},
                    },
                    decile: schoolCSV[31],
                    rollInformation:
                    {
                        totalSchoolRoll: removeComma(schoolCSV[32]),
                        europeanPakeha: removeComma(schoolCSV[33]),
                        maori: removeComma(schoolCSV[34]),
                        pasifika: removeComma(schoolCSV[35]),
                        asian: removeComma(schoolCSV[36]),
                        melaa: removeComma(schoolCSV[37]),
                        other: removeComma(schoolCSV[38]),
                        internationalStudents: removeComma(schoolCSV[39]),
                    }
                };

                let schoolId = Schools.insert(schoolObject);

                // Currently disabling creating school admin. School Admin will be created by Admin.
                //let schooladminObject = {
                //    username: 'school_admin_' + schoolObject.schoolId,
                //    email: 'school_admin_' + schoolObject.schoolId + '@gmail.com',
                //    firstName: 'John',
                //    lastName: 'Smith',
                //    password: 'school_admin_' + schoolObject.schoolId,
                //    schoolId: schoolId
                //};
                //
                //let schoolAdminId = Accounts.createUser(schooladminObject);
                //Roles.addUsersToRoles( schoolAdminId, [ ROLES.SCHOOLADMIN ], Roles.GLOBAL_GROUP );

                //if(i==20)
                //{
                //    break;
                //}
            }catch(err)
            {
                console.log("--------- Error Start--------")
                console.log(err);
                console.log(i);
                console.log(schoolCSV);
                console.log("--------- Error End--------")
            }

        }
        console.log("fixture.schools finished: ");



    }
});

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    console.log("Meteor.startup");
    //Meteor.call('fixtures.schools');

    if(Meteor.settings.fixtures && Meteor.settings.fixtures.apply)
    {
        if(Meteor.settings.fixtures.resetDatabase)
        {
            Meteor.call('resetDatabase');
        }
        if(Meteor.settings.fixtures.applyFixtures)
        {
            for(var i=0; i < Meteor.settings.fixtures.applyFixtures.length; i++)
            {
                Meteor.call('fixtures.' + Meteor.settings.fixtures.applyFixtures[i]);
            }
        }
        console.log("fixture finished: ");

        if(Meteor.settings.fixtures.exitAfterRun)
        {
            process.exit(0);
        }

    }
});


