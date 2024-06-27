const APIError = require("../../api/APIError");
const eggspress = require("../../api/eggspress");
const { UserActorType } = require("../../services/auth/Actor");
const { Context } = require("../../util/context");

module.exports = eggspress('/auth/grant-user-group', {
    subdomain: 'api',
    auth2: true,
    allowedMethods: ['POST'],
}, async (req, res, next) => {
    const x = Context.get();
    const svc_permission = x.get('services').get('permission');

    // Only users can grant user-group permissions
    const actor = Context.get('actor');
    if ( ! (actor.type instanceof UserActorType) ) {
        throw APIError.create('forbidden');
    }

    if ( ! req.body.group_uid ) {
        throw APIError.create('field_missing', null, {
            key: 'group_uid'
        });
    }

    if ( ! req.body.permission ) {
        throw APIError.create('field_missing', null, {
            key: 'permission'
        });
    }

    await svc_permission.grant_user_group_permission(
        actor, req.body.group_uid, req.body.permission,
        req.body.extra || {}, req.body.meta || {}
    );

    res.json({});
});
