const ObjectId = require('mongoose').Types.ObjectId;
const db = require('../js/util/connection');
const {get} = require('lodash');
const Q = require('q');
const {User} = require('../js/models/user.schema');


async function userIdLowerCase() {
    const deferred = Q.defer();
    try {
        //By using .lean() we only get JS objects 
        //upon which we can't perform mongoose operations
        //Such as findOneAndUpdate(),find(),findOne() etc... (X)

        //To use mongoose methods we have to call them on schemas here only

        const users = await User.find({userid: /[A-Z]/}).lean();
          
        let count = 1;
        for (let i = 0; i < users.length; i++) {
            const user = get(users, i);
            await User.findOneAndUpdate({_id: new ObjectId(user._id)}, {$set: {userid: user.userid.toLowerCase()}}).catch((err) => {
                console.log(err);
            });
            console.log(`Updated ${count} of ${users.length}`);
            count++;
        }
        deferred.resolve();
    } catch (err) {
        deferred.reject(err);
    }
    return deferred.promise;
}


userIdLowerCase()
    .then(() => {
        console.log('Script Ran Successfully');
    })
    .catch((err) => {
        console.log(err);
    });
