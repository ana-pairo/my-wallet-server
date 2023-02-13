import httpStatus from "http-status";
import sessionsService from "./sessions.service.js";

export async function registerNewSession(req, res) {
    const { loginData } = res.locals;
    try {
        const newSessionToken = await sessionsService.createNewSession({
            loginData,
        });

        return res.status(httpStatus.CREATED).send(newSessionToken);
    } catch (error) {
        return res
            .status(httpStatus.NOT_FOUND)
            .send("E-mail não cadastrado e/ou senha incorreta");
    }
}

export async function closeUserSession(req, res) {
    const { token } = res.locals;

    try {
        await sessionsService.deleteSessionRegister({ token })

        return res.sendStatus(httpStatus.OK)
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}