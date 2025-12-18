mv testserver.com ../../../../etc/nginx/sites-available/api.$1.dosystemsinc.com 2>&1 | tee -a test1234.txt
mv testserver1.com ../../../../etc/nginx/sites-enabled/api.$1.dosystemsinc.com 2>&1 | tee -a test1234.txt
# mv clientServer.com ../../../../etc/nginx/sites-available/$1.dosystemsinc.com 2>&1 | tee -a test12345.txt
# echo testnitttttttt
# mv clientServer1.com ../../../../etc/nginx/sites-enabled/$1.dosystemsinc.com 2>&1 | tee -a test12345.txt

echo certbot --nginx --non-interactive --agree-tos -d api.$1.dosystemsinc.com --redirect


mv babelrc.com ../../../../var/www/api.$1.dosystemsinc.com/server/.babelrc
PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"

# install node modules
# /root/.nvm/versions/node/v16.14.2/bin/npm install
ln -s ~/modules/node_modules node_modules

echo successfull
# PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"
# /root/.nvm/versions/node/v16.14.2/bin/node server-start.js 2>&1 | tee -a test1234.txt

#add name to pm2
# mongorestore --db $1 mongodump/$1 --noIndexRestore

echo uttej entered
# mongo is deprecated in mongodb 7, replace with mongosh 
mongosh admin -u jayeesha -p Temp1234$ --eval "db.getSiblingDB('$1').createUser({user: '$1', pwd: 'Admin1234$', roles: ['readWrite']})"

PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"
if [ "$2" = "update" ]; then
    /root/.nvm/versions/node/v16.14.2/bin/pm2 delete $3
fi
/root/.nvm/versions/node/v16.14.2/bin/pm2 start server-start.js --name $1 2>&1 | tee -a test1234.txt 

pm2 restart $1

echo RESTART SUCCESSFULL

service nginx restart 2>&1 | tee -a test1234.txt
