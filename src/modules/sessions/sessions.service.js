import { v4 as uuid } from "uuid";
import { usersRepository } from "../../repositories/users.repository.js";
import { notFoundError } from "../../errors/index.js";
import bcrypt from "bcrypt";
import { sessionsRepository } from "../../repositories/sessions.repository.js";

export async function createNewSession({ loginData }) {
    const token = uuid();

    const user = await usersRepository.selectUserByEmail({
        email: loginData.email,
    });

    if (!user._id) throw notFoundError();

    if (user && bcrypt.compareSync(loginData.password, user.password)) {
        const data = {
            userId: user._id,
            token,
        };

        await sessionsRepository.insertNewSession({ data });

        return token;
    }

    throw notFoundError();
}

export async function deleteSessionRegister({ token }) {
    return sessionsRepository.deleteSession({ token });
}

const sessionsService = {
    createNewSession,
    deleteSessionRegister,
};

export default sessionsService;
