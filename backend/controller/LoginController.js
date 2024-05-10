const { User } = require('../model/Login')
const { Student } = require('../model/Student')
const { Staff } = require('../model/Staff')
const JWT_Key = 'RedotSolution'
const Secret_key = "Admin"
const Student_Key = 'Students'
const jwt = require('jsonwebtoken')

//Admin SignUp
const SignUp = async (req, res) => {
    const { Name, Email, Password } = req.body;
    let ExistingUser
    try {
        ExistingUser = await User.findOne({ Email: Email })
    }
    catch (err) {
        return new Error(err);
    }
    if (ExistingUser) {
        return res.status(404).json({ message: "User Already Register" })
    }
    const user = new User({
        Name, Email, Password,
    })

    try {
        await user.save();
    }
    catch (err) {
        console.log(err)
    }

    return res.status(200).json({ message: 'Register Successfully', User: user })
}
const AdminLogin = async (req, res, next) => {
    const { Email, Password } = req.body;
    let ExistingUser;
    try {
        ExistingUser = await User.findOne({ Email: Email });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!ExistingUser) {
        return res.status(404).json({ message: "User Not Found. Please Sign Up." });
    }

    // Check password validity
    const Ispswd = await User.findOne({ Password });
    if (!Ispswd) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    try {
        const token = jwt.sign({ id: ExistingUser._id }, Secret_key, { expiresIn: '1hr' });

        res.cookie(String(ExistingUser._id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60),
            httpOnly: true,
            sameSite: 'lax'
        });
        return res.status(200).json({ token, message: 'Logged In Successfully', user: ExistingUser });
    } catch (error) {
        console.error('Error generating token:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
const Refresh = async (req, res, next) => {
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(400).json({ message: "No cookies found in the request headers" });
    }
    const tokenPair = cookies.split("=");
    if (tokenPair.length < 2) {
        return res.status(400).json({ message: "Invalid cookie format" });
    }
    const Prevtoken = tokenPair[1];
    jwt.verify(String(Prevtoken), Secret_key, async (err, user) => {
        if (err || !user) {
            return res.status(403).json({ message: "Authentication Failed" });
        }

        try {
            const token = jwt.sign({ id: user.id }, Secret_key, { expiresIn: '1hr' });
            console.log("Regenerate Token", token);
            res.cookie(String(user.id), token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60),
                httpOnly: true,
                sameSite: 'lax'
            });
            return res.status(200).json({ token, message: 'Token Refreshed Successfully' });
        } catch (error) {
            console.error('Error generating token:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};


const Verify = async (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log(cookies, '----Cookies');

    const token = cookies ? cookies.split("=")[1] : null;
    console.log(token, '------token');

    if (!token) {
        return res.status(404).json({ message: "No Token Found" });
    }

    jwt.verify(String(token), Secret_key, (err, user) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(400).json({ message: "Unauthorized" });
        }

        console.log(user.id);
        req.id = user.id;
        next();
    });
};

const GetUser = async (req, res, next) => {
    const UserId = req.id;
    try {
        const user = await User.findById(UserId, '-password');
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const Logout = async (req, res, next) => {
    const cookies = req.headers.cookie;
    const tokenPair = cookies.split("=")[1];
    if (!tokenPair) {
        return res.status(400).json({ message: "Could not Find Token" });
    }
    jwt.verify(String(tokenPair), Secret_key, async (err, user) => {
        if (err || !user) {
            return res.status(403).json({ message: "Authentication Failed" });
        }
        res.clearCookie(`${user.id}`);
        return res.status(200).json({ message: "Successfully Logged Out" })
    })

}

const StaffLogin = async (req, res) => {
    const { Email, Password } = req.body;

    // Validation: Check if Email and Password are provided
    if (!Email || !Password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    try {
        let existingUsers;

        // Fetch all users
        existingUsers = await Staff.find({}, 'Email Password').lean();

        // Check if any user with the given email exists
        const existingUser = existingUsers.find(user => user.Email === Email);

        if (!existingUser) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        // Compare Passwords
        const isPasswordCorrect = (Password === existingUser.Password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: existingUser._id }, JWT_Key, { expiresIn: '1hr' });

        // Cookie - GMT to IST:
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(Date.now() + istOffset);

        // Set cookie
        res.cookie(String(existingUser._id), token, {
            path: '/',
            expires: new Date(istNow.getTime() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax'
        });

        // Return success response
        return res.status(200).json({ message: 'Logged in Successfully', staff: existingUser, token });
    }
    catch (err) {
        // Handle any other errors
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
const StaffRefresh = async (req, res, next) => {
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(400).json({ message: "No cookies found in the request headers" });
    }
    const tokenPair = cookies.split("=");
    if (tokenPair.length < 2) {
        return res.status(400).json({ message: "Invalid cookie format" });
    }
    const Prevtoken = tokenPair[1];
    jwt.verify(String(Prevtoken), JWT_Key, async (err, user) => {
        if (err || !user) {
            return res.status(403).json({ message: "Authentication Failed" });
        }

        try {
            const token = jwt.sign({ id: user.id }, JWT_Key, { expiresIn: '1hr' });
            console.log("Regenerate StaffToken", token);
            res.cookie(String(user.id), token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60),
                httpOnly: true,
                sameSite: 'lax'
            });
            return res.status(200).json({ token, message: 'Token Refreshed Successfully' });
        } catch (error) {
            console.error('Error generating token:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};
const StaffVerify = async (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log(cookies, '----Cookies');

    const token = cookies ? cookies.split("=")[1] : null;
    console.log(token, '------token');

    if (!token) {
        return res.status(404).json({ message: "No Token Found" });
    }

    jwt.verify(String(token), JWT_Key, (err, user) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(400).json({ message: "Unauthorized" });
        }

        console.log(user.id);
        req.id = user.id;
        next();
    });
};

const StaffGetUser = async (req, res, next) => {
    const UserId = req.id;
    try {
        const user = await Staff.findById(UserId, '-password');
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const StaffLogout = async (req, res, next) => {
    const cookies = req.headers.cookie;
    const tokenPair = cookies.split("=")[1];
    if (!tokenPair) {
        return res.status(400).json({ message: "Could not Find Token" });
    }
    jwt.verify(String(tokenPair), JWT_Key, async (err, user) => {
        if (err || !user) {
            return res.status(403).json({ message: "Authentication Failed" });
        }
        res.clearCookie(`${user.id}`);
        return res.status(200).json({ message: "Successfully Logged Out" })
    })

}



module.exports = {
    SignUp,
    AdminLogin,
    Verify,
    GetUser,
    Refresh,
    Logout,
    StaffLogin,
    StaffGetUser,
    StaffVerify,
    StaffRefresh,
    StaffLogout,

}