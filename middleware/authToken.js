// HEADER AUTHORİZATİON DA GİRİLEN TOKEN IN KONTROLÜ

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        
        const token = req.headers['authorization'].split(" ")[1];
        //const token = req.headers.authorization.split(" ")[1];// Bir üst satırdaki kod ile AYNI, Bearer kısmından sonrasını almak için

        /* ".verify()" methodunun;
            1.parametresi yetkinin aranacağı --> TOKEN,
            2.parametre verify edilecek .env dosyasındaki --> KEY,
            NOT: iki parametre varsa method return olarak token'ın PAYLOAD'ını döndürür.
            3.parametre  error ve PAYLOAD'ı döndüren arrow function yazabiliriz;
                .verify() Methodunun 3 parametreli kullanımı:
                    jwt.verify(token, process.env.api_secret_key, (err,loginingUser)=>{
                        if(err) return res.sendStatus(403) // token var ama artık geçerli değil ise 403
                        req.body.username = loginingUser.username;
                        next();
                });*/
        const payLoad = jwt.verify(token,process.env.access_key)
        //console.log(decodedToken);
        //res.headers.authorization = decodedToken;
        // req.userData = decodedToken;
        // req.body.username = loginingUser.username;
        next();
    } catch (err) { //eğer try bloğunda değişkenlerden biri undefined olursa (mesela header'ın olmaması gibi) catch bloğu hatayı ekrana verir.
        console.log(err);
        return res.sendStatus(401);
    }
        
}