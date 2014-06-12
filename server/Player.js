var Character   = require('./Character'),
    inventory   = require('./inventory');

module.exports = Character.extend({

    create: function (id, playerData, server, Sync) {
        // normally load position from database...
        var x = 1000, y = 1000;

        var self = Character.create.call(this, id, 'player', x, y);

        self.server = server;
        self.Sync = Sync;
        self.username = playerData.username;

        self.chatQueue = [];
        self.stats = {
            agility:20, // move speed
            attackSpeed:.5, // attack speed
            dexterity:20, // range damage
            endurance:20, // health
            intellect:20, // mana
            rejuvenation:20, // health rejuv
            resilience:0, //
            strength:20, // melee damage
            willpower:20 // magic damage
        };
        self.maxHealth = self.stats.endurance*5;
        self.health = self.maxHealth;

        self.slot = {
            head:false,
            torso:false,
            legs:false,
            feet:false,
            hands:false,
            neck:false,
            ring1:false,
            ring2:false,
            weapon:false,
            shield:false
        };

        self.keys = {
            'w':false,
            'a':false,
            's':false,
            'd':false
        };
        self.velocity = 100;

        Sync.create('chatQueue').change(self.chatQueue.push);
        Sync.create('keydown').change(function (data) {
            self.keys[data] = true;
        });
        Sync.create('keyup').change(function (data) {
            self.keys[data] = false;
        });
        Sync.create('changeDirection').change(self.changeDirection); // not implemented yet
        Sync.create('leftmousedown').change(function (data) {
            // in the future, get data from active spell
            var pos = self.getPosition();
            var v, r, d;
            if (data.skill === 'small') {
                v = 200,
                r = 3,
                d = 10;
            } else if(data.skill === 'big') {
                v = 100,
                r = 7,
                d = 40;
            }
            self.server.addProjectile(self.id, pos.x, pos.y, pos.x+data.x, pos.y+data.y, v, r, d);
        });
        /*self.socket.on('close', function() {
            // save data to database
            self.server.removePlayer(self.id);
        });*/
    },

    emptyChatQueue: function () {
        if (this.chatQueue.length > 0) {
            var temp = this.chatQueue;
            this.chatQueue = [];
            return temp;
        } else {
            return false;
        }
    },

    equip: function (itemName) {
        item = inventory.query({name:itemName});
        if (item) {
            if (this.slot[item.type]) {
                this.unequip(item.name);
            }
            this.slot[item.type] = item;
            for (stat in item.stats) {
                this.stats[stat] += item.stats[stat];
            }
        } else {
            console.log('item '+itemName+' not found')
        }
    },

    registerHit: function (projectile) {
        var self = this;
        this.health -= projectile.damage;
        console.log('remove '+projectile.damage+' health from player '+this.id);

        this.socket.send(JSON.stringify({
            event: 'resourceChange',
            data: {
                bar:        'health',
                current:    this.health,
                max:        this.maxHealth
            }
        }));

        if (this.health <= 0) {
            this.server.removePlayer(this.id);
            this.socket.send(JSON.stringify({
                event:'death'
            }));
        }
    },

    unequip: function (itemName) {
        item = inventory.query({name:itemName});
        for (stat in this.slot[item.type].stats) {
            this.stats[stat] -= this.slot[item.type].stats[stat];
        }
    },

    updatePosition: function (timeDelta) {
        var distance = Math.round((((this.keys.w || this.keys.s) && (this.keys.a && this.keys.d)) ?
            this.velocity*Math.sqrt(2) : this.velocity) * timeDelta),
            prevX = this.x,
            prevY = this.y;
        if (this.keys.w) {
            this.y -= distance;
        }
        if (this.keys.a) {
            this.x -= distance;
        }
        if (this.keys.s) {
            this.y += distance;
        }
        if (this.keys.d) {
            this.x += distance;
        }
        if (prevX !== this.x || prevY !== this.y) {
            this.changes.x = this.x;
            this.changes.y = this.y;
        }
    }

});
