function Shapes()
{
    
    this.blankMap = function(width, height)
    {
        var out = [];

        for(var x = 0;x < width;x++)
        {
            out[x] = [];

            for(var y= 0;y < height;y++)
            {
                out[x][y] = 0;
            }
        }

        return out;
    }

    this.getRect = function(width, height)
    {
        var out = [];

        for(var x = 0;x < width;x++)
        {
            out[x] = [];

            for(var y= 0;y < height;y++)
            {
                out[x][y] = 1;
            }
        }

        return out;
    }


    this.getBullet = function()
    {
        var out = [
             [0,1,1]
            ,[1,1,0]
            ,[0,1,0]
        ];

        return out;
    }
}