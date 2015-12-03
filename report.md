Vagrant:
Vagrant is a tool for building complete development environmetns.
Vagrant lowers development environment setup time, increaers development/production parity, and makes the "works on my machine" excuse relic of the past.

Virtual box:
Virtual box is a tool for running different operating Systems on top of your default operating system.

Grunt:
Grunt is a task-based command line build tool built on top of NodeJS.

npm:
npm is the default Package manager for the JavaScript runtime environment 
NodeJS.

nodejs:
NodeJS is an open-source, cross-platform runtime environment for developing server-side web applications.

bower:
Bower is a package manager for Javascript libraries that allows you to define, version, and retrive your dependencies.

Add to your report started yesterday the topology of the deployment path so far. Also, add to the description of components asked for on day one, how they relate to the concepts introduced in the lectures so far, especially "release antipatterns".

Um Deployment path-inn:
	Á þessum tímapunkti í verkefninu þá erum við með build scriptu og deploy scriptu.
	build scriptan byrjar á að keyra npm install og bower install. Svo er appið buildað með að keyra grunt. Ef buildið fail-ar ekki þá 
        er docker image-ið buildað. Deploy er scripta sem passar upp á að það að nýjasta útgáfan er alltaf keyrandi. Deploy scriptan virkar þannig         að þegar hún er keyrð þá er nýja docker image-ið pushað á docker hub, development vélin ssh-ar sig inn á test vélinna, 
        test vélinn pullar nýjasta docker image-ið, terminatar gamla image-inu og keyrir það nýja upp. 
	Nú er búið að tengja jenkins við verkefnið, en jenkins er continious integration server sem buildar verkefnið og keyrir deploy scriptuna 
        ef build-ið er success. 
