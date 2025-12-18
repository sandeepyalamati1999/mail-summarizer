
SERVERLOCATION=/var/www/nocodetestapi.aicodeless.com/server/downloads/ticket_1727368093374/ticket
CLIENTLOCATION=/var/www/nocodetestapi.aicodeless.com/server/downloads/ticket_1727368093374/ticket/Admin/localsetup.sh

[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"


cd $SERVERLOCATION/server/



#INSTALL THE NODE 16.14.2 VERSION
nvm install 16.14.2

#USE NODE 16.14.2
nvm use 16.14.2

#DOWNLOAD THE NODE_MODULES
npm install


#CHANGE THE PERMISSION FOR SCRIPT FILE (EXECUTABLE)
chmod +x $CLIENTLOCATION

#OPEN NEW TERMINAL FOR CLIENT
gnome-terminal --tab -- bash -c "$CLIENTLOCATION; exec bash"



#START SERVER
node server-start.js


#OPEN NEW TERMINAL FOR CLIENT




