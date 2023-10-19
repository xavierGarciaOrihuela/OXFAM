const jwt = require('jsonwebtoken');
const Joi = require('joi');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')

const compare = async  (passwordPlain, hashPassword) => {
    return await bcrypt.compare(passwordPlain, hashPassword)
}

const encrypt = async (passwordPlain) => {
    const hash = await bcrypt.hash(passwordPlain, 10);
    return hash;
}

const replaceSpecialChars = (text) => { //evitar inyecciones sql
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const checkIfIsNull = (valueToCheck) => {
    if (valueToCheck == null || valueToCheck == "") return true
    return false
}
const checkValues = (valueToCheck) => { //Comprobación parámetros entrada
    return replaceSpecialChars(valueToCheck)
}

const usernameSchema = Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': `"username" must only contain alphanumuerical caracters`,
    'string.min': `"username" must have a minimum length of {#limit}`,
    'string.max': `"username" must have a maximum length of {#limit}`,
    'string.empty': `"username" must not be empty`,
    'any.required': `"username" is a required field`,
  });

const passwordSchema = Joi.string().min(8).max(64).pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/).required().messages({
    'string.empty': `"password" must not be empty`,
    'string.required': `"password" is required`,
    'string.min': `"password" must have a minimum length of {#limit}`,
    'string.max': `"password" must have a maximum length of {#limit}`,
    'string.pattern.base': `"password" must have at least one digit, one lower case and one upper case characters`,
  });

const refTokenCookieProps = {
    domain: "fitapp.garlicbread.fun",
    httpOnly: true,
    path: "/auth/refToken",
    secure: true,
    sameSite: true,
};

const loginUserSchema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
});

const loginUser = async (req, res) => {
    try {

        const { error, value } = loginUserSchema.validate(req.body, {abortEarly : false});
        if (error) {
            return res.status(400).json({
                status: "error", 
                type: "validation-error",
                title: "Could not validate request paramteters", 
                error_messages: error.details.map(function(obj) {return obj.message})});
        }

        const cleanUsername = checkValues(value.username)

        /*const user = await pool.query('SELECT * FROM users WHERE username=$1', [ cleanUsername ])//HACER CONEXIÓN CON DB
        if (!user.rows[0]) {
            res.status(404).send("El usuario no existe")
            return;
        }/*/
        //const checkPassword = await compare(123, 123)
        //const checkPassword = 
        if (checkPassword) {
            const refreshToken = await createRefreshToken(user.rows[0].id)
            const accessToken = await generateAccessToken(user.rows[0].id, user.rows[0].role)

            res.status(200).cookie('refreshToken', refreshToken, refTokenCookieProps).json({accessToken: accessToken})
        } else {
            res.status(401).send('La contraseña no es correcta. Vuelva a intentarlo')
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).send('Internal server error⚠️');
    }
}
const refToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Cojo el refreshToken de la cookie
    if (!refreshToken) {
        res.status(400).send("No valid session found");
        return;
    }

    var decoded;
    try {
        decoded = await verifyRefreshToken(refreshToken);
    } catch (errpr) {
        res.status(401).send("Refresh token not valid");
        return;
    }

    pool.connect().then(async (client) => {
        try {
            var date = new Date();
            date.setDate(date.getDate() + 7);
            const new_session_token = crypto.randomBytes(16).toString('base64');

            await client.query('BEGIN');

            const session_id = decoded.session;
            const refresh_token = decoded.token;
            const new_refresh_token = jwt.sign({session: session_id, token: new_session_token}, process.env.SECRET_KEY_RT, {expiresIn: '7d'});
    
            const session = await pool.query('SELECT user_id, session_token FROM login_sessions WHERE session_id=$1 FOR UPDATE', [ session_id ]);
        
            if (!session.rows[0]) {
                client.query('COMMIT');
                res.status(401).send("Session expired");
                return;
            }

            // Deteccion de reuso
            if (session.rows[0].session_token != refresh_token) {
                await client.query('DELETE FROM login_sessions WHERE session_id=$1', [ session_id ]);
                await client.query('COMMIT');
                
                res.status(401).send("Token reused");
                return;
            }

            // Actualizar el token en la BD
            await client.query('UPDATE login_sessions SET session_token=$1, expired_at=$2 WHERE session_id=$3', [new_session_token, date, session_id]);

            await new_refresh_token;

            await client.query('COMMIT');


            const user = await client.query('SELECT role FROM users WHERE id=$1', [ session.rows[0].user_id ]);

            if (!user.rows[0]) {
                res.status(410).send("User no longer exists");
                return;
            }

            const accessToken = await generateAccessToken(session.rows[0].user_id, user.rows[0].role);

            res.status(200).cookie('refreshToken', new_refresh_token, refTokenCookieProps).json({accessToken: accessToken})
        }
        catch(error) {
            await client.query('ROLLBACK');
            console.log(error);
            res.status(500).send("Internal server error");
        }
        finally {
            client.release();
        }
    }).catch((error => {
        console.log(error);
        res.status(503).send("Internal server database connection error");
    }));
}


const getUserInfo =  async (req, res) => {
    const user_id = req.decoded_token.userId;

    try {
        const userinfo = await pool.query('SELECT username, email FROM users WHERE user_id=$1', [ user_id ]);
        res.status(200).json({status: "success", username: userinfo.rows[0].username, email: userinfo.rows[0].email}); 
    }
    catch (error) {
        console.log(error)
        res.status(500).send("No se pudo conectar correctamente con el servidor. Vuelva a intentarlo")
  }
}

const healthCheck = async (req, res) => {
    res.status(200).send("Alive");
}



app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    res.json({ success: true, message: 'Inicio de sesión exitoso' });
  });



module.exports = {
    loginUser,
    registerUser,
    getUserInfo,
    healthCheck,
    refTokenm,
}