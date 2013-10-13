module.exports = {
    query:function(attributes) {
        var tests = Object.keys(attributes).length;
        for(var i = 0; i < inventory.length; i++) {
            var passed = 0;
            for(attr in attributes) {
                if(!(attr in inventory[i]) || attributes[attr] !== inventory[i][attr]) {
                    break;
                }else{
                    passed++;
                };
            };
            if(passed === tests) {
                return inventory[i];
            };
        };
        return false;
    }
};

var inventory = [
    {
        name:'Inky Cap',
        type:'head',
        rarity:1,
        stats:{
            resilience:1,
            intellect:3
        },
        value:10
    },
    {
        name:'Fly Agaric',
        type:'mushroom',
        rarity:2,
        value:20
    },
    {
        name:'Gloves of the Great Harvest',
        type:'hands',
        rarity:4,
        stats:{
            resilience:3,
            dexterity:4
        },
        value:80
    },
    {
        name:'Steel Boots of the Boar',
        type:'feet',
        rarity:2,
        stats:{
            resilience:10,
            strength:1,
            endurance:1
        },
        value:40
    },
    {
        name:'Iron Platearmor',
        type:'torso',
        rarity:'1',
        stats:{
            resilience:10
        },
        value:25
    },
    {
        name:'Ring of Fortitude',
        type:'ring',
        rarity:1,
        stats:{
            endurance:1
        },
        value:20
    },
    {
        name:'Amulet of the Great Harvest',
        type:'neck',
        rarity:4,
        stats:{
            dexterity:3,
            endurance:2
        },
        value:100
    },
    {
        name:'Leather Leggings of the Great Harvest',
        type:'legs',
        rarity:4,
        stats:{
            resilience:5,
            dexterity:5
        },
        value:185
    },
    {
        name:'Steel Chestplate of the Great Harvest',
        type:'torso',
        rarity:4,
        stats:{
            resilience:25,
            dexterity:6
        },
        value:670
    },
    {
        name:'Cap of the Great Harvest',
        type:'head',
        rarity:4,
        stats:{
            resilience:2,
            dexterity:2
        },
        value:160
    },
    {
        name:'Sword of 1000 Truths',
        type:'weapon',
        rarity:10,
        stats:{
            strength:55,
            endurance:55
        },
        value:1000000
    },
    {
        name:'Boots of the Great Harvest',
        type:'feet',
        rarity:4,
        stats:{
            dexterity:2,
            resilience:3
        },
        value:175
    },
    {
        name:'Leather Chestarmor of the Great Harvest',
        type:'torso',
        rarity:4,
        stats:{
            dexterity:6,
            resilience:8
        },
        value:295
    }
];