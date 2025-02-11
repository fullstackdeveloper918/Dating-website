export const apiRoutes = {
    testing : 'user/testing',
    register : 'user/register',
    login : 'auth/login',
    forgotPassword: 'user/forgot-password',
    verifyEmail : 'user/verifyEmail',
    confirmPassword: 'user/update-new-password',
    resendCode : 'user/resend-pin',
    checkReferral: 'user/is-referral-use',


    // user 
    userList : 'user/list',
    getUser : 'user/edit-user',
    updateUserProfile : 'user/update-profile',
    getReferralCode : 'referral/listing',
    addReferralCode : 'referral/add',

    // get message list
    message_list : 'messages/message-list',


    // unssen message count

    unseenMessageCount: 'messages/unseen-message-count',

    // get last seen
    getLastSeen : 'user/single-user',

    // get archieved messages
    getArchievedMessages: 'messages/archive-message',

    // GET SINGLE USER INFO
    getSingleUserInfo : 'user/single-user'

    
}