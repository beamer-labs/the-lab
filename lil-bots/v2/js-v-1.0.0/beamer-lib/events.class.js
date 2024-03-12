function BeamerEventManager(config)
{
    this.listeningLoop = {};
    this.keepListening = false;
    this.eventRate = 3; //secs
    this.eventGetUrl = "";
    this.eventSendUrl = "";

    this.init = function(eventGetUrl, eventSendUrl)
    {
        this.eventGetUrl = eventGetUrl;
        this.eventSendUrl = eventSendUrl;
    }

    this.getEvents = function()
    {
        dataHandler.sendDataAndCallBack(eventHandler.eventGetUrl, {}, eventHandler.processEvents);
    }

    this.sendEvent = function(eventData)
    {
        dataHandler.sendDataAndCallBack(eventHandler.eventSendUrl, eventData, eventHandler.eventSent);
    }

    this.eventSent = function(dataPacket)
    {
        play.view.processServerEvents(dataPacket.events);
        
        //console.log("Event was sent", dataPacket.events);
    }


    this.processEvents = function(dataPacket)
    {
        play.view.processServerEvents(dataPacket.events);
    }

    this.startListening = function()
    {
        if(!this.keepListening)
        {
            this.listeningLoop = setInterval("window.requestAnimationFrame(eventHandler.getEvents)",this.eventRate * 1000);
            this.keepListening = true;
        }
    }

    this.stopListening = function()
    {
        this.keepListening = false;
        clearInterval(this.listeningLoop);
    }




}