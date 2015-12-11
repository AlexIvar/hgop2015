##Vagrant:
Vagrant is a tool for building complete development environmetns. Vagrant lowers development environment setup time, increaers development/production parity, and makes the "works on my machine" excuse relic of the past.

##Virtual box:
Virtual box is a tool for running different operating Systems on top of your default operating system.

##Grunt:
Grunt is a task-based command line build tool built on top of NodeJS.

##npm:
npm is the default Package manager for the JavaScript runtime environment NodeJS.

##nodejs:
NodeJS is an open-source, cross-platform runtime environment for developing server-side web applications.

##bower:
Bower is a package manager for Javascript libraries that allows you to define, version, and retrive your dependencies.

##Um Deployment path-inn:
Á þessum tímapunkti í­ verkefninu erum við með build scriptu og deploy scriptu. build scriptan byrjar á því að keyra npm install og bower install. Svo er appið buildað með því keyra grunt. Ef buildið fail-ar ekki þá er docker image-ið buildað. Deploy er scripta sem passar upp á það að nýjasta útgáfan er alltaf keyrandi. Deploy scriptan virkar þannig að þegar hann er keyrandi þá er nýja docker image-ið pushað á docker hub, development vélin ssh-ar sig inn á test vélinna, test vélinn pullar nýjasta docker image-ið, terminatar gamla image-inu og keyrir þá nýja upp. Nú er búið að tengja jenkins við verkefnið, en jenkins er continious integration server sem buildar verkefnið og keyrir deploy scriptuna ef build-ið er success.

Update: 
Nú er búið að bæta við verkefnið acceptance test og capacity load test.
Þannig að nú þegar það er buið að keyra build scriptuna og búið að keyra deploy scriptuna þá keyri ég accepantance test sem eiga að sjá um að appið virki eins og það á að virka. Ef acceptance testin fail-a ekki þá er capacity testin keyrð en þau testa hversu langan tima eh test tekur að klárast. Eins og er, er ég með 4 accepance test og eitt capacity load test. 


##Capacity tests
Þegar ég keyrði load testin fyrst þá var ég að láta testið keyra 1000 "draw" leiki á 10 sec. En testið time-outaði alltaf því það tekur miklu lengri tima að keyra 1000 "draw" leiki í tictactoe en 10 sec. Ég minnkaði því töluna yfir hversu marga leiki ætti að spila i testinu niður í 100 leiki. Testið kláraði þá á um 2.5 - 3 sec. þannig ég lét þá time-out value-ið vera 5 sec.


##Does the load test run in serial or in parallel?

Svar:
load testin eru paralell. Node.js er single-threaded sem þýðir að það er bara einn process sem er i gangi og ser um að höndla allar skipanir í forritinu. NodeJs er líka asynhronous sem þýðir að processinn bíður ekki eftir ad eh test se buid ad keyra og heldur bara afram a næsta test og hitt testið lætur bara vita thegar thað er buid ad keyra. Testin eru ss ekki keyrd i röd heldur eftir hvad klárast fyrst.