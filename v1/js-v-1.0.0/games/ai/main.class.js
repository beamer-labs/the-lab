function Game()
{

    this.config = {};

    this.currentActionIdx = 0;

    this.view = {};

    this.menu = [];

    this.playActions = [
        {
            "screen":"show-splash"
            ,"delayTime":0
            ,"msg": "...welcome to the fun..."
        }
        ,{
            "screen":"load-assets"
            ,"delayTime":1
            ,"msg": "loading images and characters"
        },
        {
		            "screen":"show-view-entrance"
		            ,"delay":"none"
		            ,"msg": "showing view entrance"
        }
        /*

        ,{
            "screen":"is-logged-in"
            ,"delay":"ajax"
            ,"msg": "loading your id"
        }
        ,{
            "screen":"load-user-data"
            ,"delay":"ajax"
            ,"msg": "loading your account"
        }

        ,{
            "screen":"show-view-entrance"
            ,"delay":"none"
            ,"msg": "showing view entrance"
        }
		*/


    ];

    this.init = function()
    {
        this.currentActionIdx = 0;

        this.config["connect-to-server"] = false;

        play.processNextStep();

    }

    this.setupMenus = function()
    {

    }


    this.stopAutoProcessing = function()
    {
        this.currentActionIdx=9999;
    }

    this.processNextStep = function()
    {
        if(this.currentActionIdx < this.playActions.length)
        {
            var actionData = this.playActions[this.currentActionIdx];

            this.currentActionIdx++;

            console.log("Processing Action:" + actionData.screen);



            if(actionData.screen == "show-splash")
            {
                beamerGui.showView("view-splash");

                beamerGui.setMessage(actionData.msg);

                setTimeout("play.processNextStep()", actionData.delayTime * 1000);

            }


            if(actionData.screen == "load-assets")
            {
                beamerGui.showView("view-splash");

                beamerGui.setMessage(actionData.msg);

                this.loadAssets();

                setTimeout("play.processNextStep()", actionData.delayTime * 1000);
            }



            if(actionData.screen == "is-logged-in")
            {
                if(user.loginCheck())
                {
                    this.processNextStep();
                }
                else
                {
                    console.log("Goto login view");
                    this.loadLogin();
                }

            }


            if(actionData.screen == "load-user-data")
            {
                beamerGui.showLoadingScreen(actionData);

                this.syncUser();

            }

            if(actionData.screen == "show-view-entrance")
            {
                this.loadEntrance();

            }






        }


    }

    this.syncUser = function()
    {
        dataHandler.sendDataAndCallBack("server/games/sow-actions.php?action=get-user-details", {}, user.syncUser);
    }

    this.processAction = function(actionKey)
    {

        if(actionKey.includes("slow-down"))
        {
			gameConfig.gameSpeed+=100;

			this.view.changeSpeed();
        }


        if(actionKey.includes("speed-up"))
        {
			gameConfig.gameSpeed-=100;
			if(gameConfig.gameSpeed < 0) gameConfig.gameSpeed = 10;

			this.view.changeSpeed();
        }

        if(actionKey.includes("one-step"))
        {
			this.view.stopPlaying();
			this.view.process();
        }



		if(actionKey.includes("toggle-pause"))
		{
			if(this.view.keepPlaying)
			{
				this.view.stopPlaying();
			}
			else
			{
				this.view.startPlaying();
			}

        }





        if(actionKey.includes("goto-area-"))
        {
            var baseID = actionKey.substring(10);

            dataHandler.sendDataAndCallBack("server/games/sow-actions.php?action=goto-base&baseID=" + baseID, {}, play.view.reloadMap);

        }



        if(actionKey.includes("toggle-debug"))
        {
            beamerGui.toggleMenu("debug-menu");
        }


        if(actionKey == "menu-item-clicked-debug")
        {
            if(this.showClickAreas)
            {
                this.showClickAreas = false;
            }
            else
            {
                this.showClickAreas = true;
            }
        }

        if(actionKey == "enter-game")
        {
            this.loadCommandHud();
        }

        if(actionKey == "reset-acct")
        {
            var url = "server/games/sow-actions.php?action=reset-acct";

            dataHandler.sendDataAndCallBack(url, {}, this.view.syncMainMap);
        }

        this.view.processAction(actionKey);
    }


    this.loadEntrance = function()
    {
        beamerUtils.loadGameCanvas();

        beamerGui.clearClickables();

        this.view = new ViewEntrance();

        this.view.init();

        this.processNextStep();
    }




    this.loadCommandHud = function()
    {
        beamerUtils.loadGameCanvas();

        beamerGui.clearClickables();

        this.view = new ViewCommandHud();

        this.view.init();

        this.processNextStep();
    }




    this.loadAssets = function()
    {

        beamerGui.loadAssets();

        //dataHandler.sendDataAndCallBack("server/games/sow-actions-public.php?action=get-assets", {}, this.syncAssets);

    }


    this.useCard = function(cardKey, tileX, tileY)
    {

        //dataHandler.sendDataAndCallBack("server/games/sow-actions-public.php?action=get-assets", {}, this.syncAssets);

        var url = "server/games/sow-actions.php?action=use-card";
        url+="&cardKey=" + cardKey;
        url+="&tileX=" + tileX;
        url+="&tileY=" + tileY;

        dataHandler.sendDataAndCallBack(url, {}, this.view.syncMainMap);

        this.view.cardManager.cardHasBeenUsed(cardKey);
    }





    this.syncAssets = function(data)
    {
        for(var i=0;i<data.assets.length;i++)
        {
            assets.addAsset({"key":data.assets[i].imgKey, "imgSrc":data.assets[i].imgSrc});

            beamerGui.setLoadingScreenMsg("Loading " + data.assets[i].imgKey);

        }

        play.processNextStep();
    }


    this.render = function(context)
    {
        this.view.render(context);
    }

    this.tileClicked = function(tileX, tileY)
    {
        this.view.tileClicked(tileX, tileY);
    }

    this.mouseMoved = function(mouseX, mouseY){return ;}
    this.getTileSize = function() {return 32;}
    this.getMapOriginX = function(){return this.view.getMapOriginX();}
    this.getMapOriginY = function(){return this.view.getMapOriginY();}
}