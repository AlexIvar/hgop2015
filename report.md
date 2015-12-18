##Vagrant:
Vagrant er notað til að búa til og halda utan um sýndarvélinni sem okkur var gefin.

##Virtual box:
Virtual box leyfir okkur okkur að keyra stýrikerfi ofan á okkar "dafault" stýrikerfi sem við notum daglega.

##Grunt:
Grunt er "task-based" tól fyrir okkur til að builda verkfefnin okkar. Grunt er byggt ofan á NodeJS.

##npm:
npm er default Package manager fyrir NodeJS.

##nodejs:
NodeJS er open-source, cross-platform runtime umhverfi fyrir okkur til að útfæra server-side web applications.

##bower:
Bower er package manager fyrir Javascript. Í staðinn fyrir að ná í dependency fyrir NodeJS þá nær það í dependency sem notuð eru fyrir client.

##Um Deployment path-inn:
Á þessum tímapunkti í­ verkefninu erum við með build scriptu og deploy scriptu. build scriptan byrjar á því að keyra npm install og bower install. Svo er appið buildað með því keyra grunt. Ef buildið fail-ar ekki þá er docker image-ið buildað. Deploy er scripta sem passar upp á það að nýjasta útgáfan er alltaf keyrandi. Deploy scriptan virkar þannig að þegar hann er keyrandi þá er nýja docker image-ið pushað á docker hub, development vélin ssh-ar sig inn á test vélinna, test vélinn pullar nýjasta docker image-ið, terminatar gamla image-inu og keyrir þá nýja upp. Nú er búið að tengja jenkins við verkefnið, en jenkins er continious integration server sem buildar verkefnið og keyrir deploy scriptuna ef build-ið er success.

Update: 
Nú er búið að bæta við verkefnið acceptance test og capacity load test.
Þannig að nú þegar það er buið að keyra build scriptuna og búið að keyra deploy scriptuna þá keyri ég accepantance test sem eiga að sjá um að appið virki eins og það á að virka. Ef acceptance testin fail-a ekki þá er capacity testin keyrð en þau testa hversu langan tima eh test tekur að klárast. Eins og er, er ég með 4 accepance test og eitt capacity load test. 

finale update:
Nú er ég buinn að bæta við deploy to production stage í jenkins. Ef enginn test feila þá er docker image-ið deployað í production. Nú er líka hægt að deploy-a hvaða version á verkefninu. Einnig er búið að útfæra client sem gerir það að verkum að nú er hægt að spila tic tac toe leiki.


##Capacity tests
Þegar ég keyrði load testin fyrst þá var ég að láta testið keyra 1000 "draw" leiki á 10 sec. En testið time-outaði alltaf því það tekur miklu lengri tima að keyra 1000 "draw" leiki í tictactoe en 10 sec. Ég minnkaði því töluna yfir hversu marga leiki ætti að spila i testinu niður í 100 leiki. Testið kláraði þá á um 2.5 - 3 sec. þannig ég lét þá time-out value-ið vera 5 sec.


##Does the load test run in serial or in parallel?

Svar:
load testin eru paralell. Node.js er single-threaded sem þýðir að það er bara einn process sem er i gangi og ser um að höndla allar skipanir í forritinu. NodeJs er líka asynhronous sem þýðir að processinn bíður ekki eftir ad eh test se buid ad keyra og heldur bara afram a næsta test og hitt testið lætur bara vita thegar thað er buid ad keyra. Testin eru ss ekki keyrd i röd heldur eftir hvad klárast fyrst.

##Why implement the feature to track versions?
Það er mjög hjálplegt að geta farið í seinust keyrandi útgáfu á kerfinu þegar það kemur upp böggur í núverandi útgáfu. Þá er hægt að laga bögginn í núverandi útgáfu á maðan útgáfan á undan er keyrð. Einnig geta forritar sem vinna í kerfinu fundið rót vandamálsins með því að skoða gamlar útgáfur og þá er einfaldara að laga bögginn.
Hann sem er yfir verkefninu mun líklegast vera sá sem deployar eldri úftgáfu.


##What was wrong with having docker push in the deployment script rather than in the dockerbuild.sh script?
Acceptance/deploy stage-ið á ekki í raun og veru að snerta við source kóða. Og því ættum við ekki að hafa docker push í scriptunni. Acceptance/deploy stage-ið á að sjá um að pulla frá docker og keyra image-ið í test umhverfi. Einnig meikar líka sense að skyldar aðgerðir tilheyri sömu scriptunni.



##How does the "deploy any version, anywhere" build feature work? 
Þegar breytingar eru gerðar á kóða í GIT, þá þarf forritarinn að commita breytingar með því að gera git commit og koma með útskýringu á breytingunum áður en hann pushar því á "the mainline". Við getum nýtt okkur þessi commit til að deploy-a hvaða version á verkefninu í hvaða umhverfi sem er. Við í þessu verkefni notuðum git pluggin fyrir Jenkins og bash scriptu sem ssh-ar sig inn á test umhverfi og production umhverfi og einnig notum við docker. Þá veljum við hvaða útgáfu á verkefninu við viljum deploy-a og ip tölu og látum docker builda image fyrir þá útgáfu. Og svo er það image pushað og runnað í hvaða umhverfi sem er.

##Shell scipts used with jenkins:

###commit stage

####------------------------------------------------------------
export DISPLAY=:0  
export PATH=$PATH:/usr/local/bin   
npm install  
bower install  
./dockerbuild.sh $GIT_COMMIT
####-----------------------------------------------------------
###Acceptance stage

####-----------------------------------------------------------
export DISPLAY=:0  
export PATH=$PATH:/usr/local/bin   
export GIT_UPSTREAM_HASH=$(<dist/githash.txt)  
env  
./deploy.sh 8080 $GIT_UPSTREAM_HASH  
export ACCEPTANCE_URL=http://192.168.33.10:8080  
npm install  
grunt mochaTest:acceptance
####-----------------------------------------------------------
###capacity load stage 

####-----------------------------------------------------------
export DISPLAY=:0  
export PATH=$PATH:/usr/local/bin  
export ACCEPTANCE_URL=http://192.168.33.10:8080  
npm install  
grunt mochaTest:load
####-----------------------------------------------------------
###deploy to production stage

####-----------------------------------------------------------
export DISPLAY=:0  
export PATH=$PATH:/usr/local/bin  
export GIT_UPSTREAM_HASH=$(<dist/githash.txt)  
env  
./deploy.sh 9000 $GIT_UPSTREAM_HASH
####-----------------------------------------------------------
