export default {
    admin: {
        users: {
            "create:any": ["*"],
            "read:any": ["*"],
            "update:any": ["*"],
            "delete:any": ["*"],
        },
    },
    user: {
        users: {
            "create:any": ["uuid"],
            "read:own": ["uuid", "firstname", "lastname"],
            "update:own": ["firstname", "lastname", "email", "phone"],
            "delete:own": ["uuid"],
        },
    },
};
