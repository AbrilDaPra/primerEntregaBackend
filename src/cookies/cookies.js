import cookieParser from 'cookie-parser';

//Clave para seguridad
app.use(cookieParser("hola"));

app.get('/setcookie', (req, res) => {
    res
        .cookie("micookie", "hola mundo", {maxAge: 10000})
        .send("Set cookie");
})
app.get('/getcookie', (req, res) => {
    res.send(req.cookies);
})
app.get('/deletecookie', (req, res) => {
    res.clearCookie("micookie").send("Cookie removida");
})

//Cookies seguras
app.get('/setsignedcookie', (req, res) => {
    res
        .cookie("miSignedCookie", "hola mundo seguro", {maxAge: 100000, signed: true})
        .send("Set signed cookie");
})
app.get('/getsignedcookie', (req, res) => {
    res.send(req.signedCookies);
})