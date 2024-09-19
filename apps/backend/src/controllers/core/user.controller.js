import Joi from "joi";
import { getUserTodayItems, getUserOverdueItems, getUserItemsByDate, getUserItems } from "../../services/lib/item.service.js";
import { moveItemtoDate } from "../../services/lib/integration.service.js";
import { updateUser } from "../../services/core/user.service.js";

const { ValidationError } = Joi;

// const userProfileController = async (req, res, next) => {
//     try {
//         const user = req.user;
//         const { integration, ...userWithoutIntegration } = user.toObject ? user.toObject() : user;

//         res.json(userWithoutIntegration);
//     } catch (err) {
//         next(err)
//     }
// };

const userProfileController = async (req, res, next) => {
    try {
        const user = req.user;
        const { integration, uuid, fullName, userName, avatar, roles, timezone } = user.toObject ? user.toObject() : user;

        // Dynamically compute 'connected' status based on whether the fields have values
        const response = {
            uuid,
            fullName,
            userName,
            avatar,
            roles,
            timezone,
            integrations: {
                linear: { connected: !!integration.linear.accessToken }, // Assume accessToken is required to be 'connected'
                googleCalendar: { connected: !!integration.googleCalendar.accessToken }, // Check for accessToken
                gmail: { connected: !!integration.gmail.accessToken }, // Check for accessToken
                github: { connected: !!integration.github.installationId }, // Check for installationId
                notion: { connected: !!integration.notion.accessToken } // Check for accessToken
            }
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
};

const updateUserController = async (req, res, next) => {
    try {
        const user = req.user;
        // const payload = await UpdateUserPayload.validateAsync(req.body)

        const data = req.body;

        await updateUser(user, data);

        res.json({
            "message": "Updated successfully"
        })
    } catch (err) {
        const error = new Error(err)
        error.statusCode = err instanceof ValidationError ? 400 : (err.statusCode || 500)
        next(error);
    }
};

const getUserItemsController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const items = await getUserItems(me);

        // const IntegratedAppIssues = await getIntegration(me);
        // res.json({
        //     items
        // });
        res.status(200).json({
            statusCode: 200,
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getUserTodayItemsController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const items = await getUserTodayItems(me);
        res.json({
            status: 200,
            response: {
                items
            }
        });
    } catch (err) {
        next(err);
    }
};

const getUserOverdueItemsController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const items = await getUserOverdueItems(me);
        res.json({
            status: 200,
            response: {
                items
            }
        });
    } catch (err) {
        next(err);
    }
};

const getUserItemsByDateControlle = async (req, res, next) => {
    try {
        const me = req.user.id;
        const { date } = req.params;
        const items = await getUserItemsByDate(me, date);
        res.json({
            status: 200,
            response: {
                items
            }
        });
    } catch (err) {
        next(err);
    }
};

const moveItemtoDateController = async (req, res, next) => {
    try {
        const { id, date } = req.body;
        const items = await moveItemtoDate(date, id);
        res.json({
            status: 200,
            response: {
                items
            }
        });
    } catch (err) {
        next(err);
    }
};

export {
    userProfileController,
    updateUserController,
    getUserItemsController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateControlle,
    moveItemtoDateController
}
