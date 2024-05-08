const getSuperAdminRole = async () => {
    try {
        await strapi.admin.services.role.createRolesIfNoneExist();
    } catch (e) {
        strapi.log.error(`Couldn't check for & create existing roles.`, e);
    }

    let superAdminRole = await strapi.db.query("admin::role").findOne({
        select: [],
        where: { code: "strapi-super-admin" },
        orderBy: {},
        populate: {},
    });

    if (!superAdminRole) {
        superAdminRole = await strapi.db.query("admin::role").create({
            data: {
                name: "Super Admin",
                code: "strapi-super-admin",
                description:
                    "Super Admins can access and manage all features and settings.",
            }
        });
    }

    return superAdminRole;
}

const initAdminData = (env) => {
    const useJsonData = (initAdminString) => {
        let adminData = {};
        try {
            adminData = JSON.parse(initAdminString)
        } catch (e) {
            strapi.log.error(`Couldn't parse adminData from INIT_ADMIN.`, e);
        }
        return adminData;
    }
    return {
        username: env.INIT_ADMIN_USERNAME || 'admin',
        password: env.INIT_ADMIN_PASSWORD || 'admin',
        firstname: env.INIT_ADMIN_FIRSTNAME || 'Admin',
        lastname: env.INIT_ADMIN_LASTNAME || 'Admin',
        email: env.INIT_ADMIN_EMAIL || 'admin@your-domain.com',
        blocked: false,
        isActive: true,
        ...(typeof env.INIT_ADMIN === "string" && env.INIT_ADMIN.includes('{"') && {
            ...useJsonData(env.INIT_ADMIN)
        })
    }
}


module.exports = async () => {
    // On strapi startup
    if (
        process.env.NODE_ENV === "development" ||
        process.env.INIT_ADMIN === "true" ||
        (typeof process.env.INIT_ADMIN === "string" && process.env.INIT_ADMIN.includes('{"'))
    ) {
        const users = await strapi.db.query("admin::user").findMany();
        if (users.length === 0) {
            const defaultAdmin = initAdminData(process.env);
            const superAdminRole = await getSuperAdminRole();
            defaultAdmin.roles = [superAdminRole.id];
            defaultAdmin.password = await strapi.service("admin::auth").hashPassword(defaultAdmin.password);
            try {
                await strapi.db.query("admin::user").create({ data: { ...defaultAdmin } });
                strapi.log.info(`Created admin (E-Mail: ${defaultAdmin.email}, Password: ${process.env.INIT_ADMIN_PASSWORD ? "[INIT_ADMIN_PASSWORD]" : "admin"}).`);
            } catch (e) {
                strapi.log.error(`Couldn't create admin (${defaultAdmin.email}):`, e);
            }
        }
    }
};