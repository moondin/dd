---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1268
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1268 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: change_board_background_image.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/change_board_background_image.json

```json
{
    "model":{
        "id":"59780df0f985476615f5ea6a",
        "name":"Welcome Board",
        "desc":"",
        "descData":null,
        "closed":false,
        "idOrganization":null,
        "pinned":false,
        "url":"https://trello.com/b/iR0fe7ne/welcome-board",
        "shortUrl":"https://trello.com/b/iR0fe7ne",
        "prefs":{
            "permissionLevel":"private",
            "voting":"disabled",
            "comments":"members",
            "invitations":"members",
            "selfJoin":true,
            "cardCovers":true,
            "calendarFeedEnabled":false,
            "background":"59b7d0e1443cddf631c53a93",
            "backgroundImage":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/f875a4638e0662f49d91e5295f7f76a9/photo-1505150643203-7a35720d76c6",
            "backgroundImageScaled":[
                {
                    "width":140,
                    "height":100,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/140x100/d9a6c1e0ccec47a25505569cafa30340/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":256,
                    "height":192,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x192/23826573fbf5d32c5e9aeebe662526ce/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":480,
                    "height":480,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x480/1f48d9f160296facf8b306749b9c7e3c/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":960,
                    "height":960,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/960x960/91264ea69a09a3de35cab60f2e3dbe31/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":1024,
                    "height":1024,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1024x1024/8d0342dfb519de1c40e63475ce87f9dd/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":2048,
                    "height":2048,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2048x2048/696ae241e26150b8c460d0294d4c1928/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":1280,
                    "height":1280,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1280x1280/3b7b38da5e996ad302a75bf3c5d127fe/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":1920,
                    "height":1920,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1920x1920/e1a2b009d9a68fadf870ff35fd659a15/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":2560,
                    "height":1600,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1600/e2e1fd2f18d6165f0cc3e625533f1cd1/photo-1505150643203-7a35720d76c6.jpg"
                },
                {
                    "width":2560,
                    "height":1707,
                    "url":"https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/f875a4638e0662f49d91e5295f7f76a9/photo-1505150643203-7a35720d76c6"
                }
            ],
            "backgroundTile":false,
            "backgroundBrightness":"dark",
            "backgroundBottomColor":"#0b0504",
            "backgroundTopColor":"#396b84",
            "canBePublic":true,
            "canBeOrg":true,
            "canBePrivate":true,
            "canInvite":true
        },
        "labelNames":{
            "green":"",
            "yellow":"",
            "orange":"",
            "red":"",
            "purple":"",
            "blue":"",
            "sky":"",
            "lime":"",
            "pink":"",
            "black":""
        }
    },
    "action":{
        "id":"59bb22be8b214c452bed7c65",
        "idMemberCreator":"59780df0f985476615f5ea66",
        "data":{
            "board":{
                "shortLink":"iR0fe7ne",
                "name":"Welcome Board",
                "id":"59780df0f985476615f5ea6a",
                "prefs":{
                    "background":"59b7d0e1443cddf631c53a93"
                }
            },
            "old":{
                "prefs":{
                    "background":"lime"
                }
            }
        },
        "type":"updateBoard",
        "date":"2017-09-15T00:45:50.508Z",
        "memberCreator":{
            "id":"59780df0f985476615f5ea66",
            "avatarHash":null,
            "fullName":"Eeshan Garg",
            "initials":"EG",
            "username":"eeshangarg"
        },
        "display":{
            "translationKey":"action_changed_board_background",
            "entities":{
                "board":{
                    "type":"board",
                    "id":"59780df0f985476615f5ea6a",
                    "text":"Welcome Board",
                    "shortLink":"iR0fe7ne"
                },
                "memberCreator":{
                    "type":"member",
                    "id":"59780df0f985476615f5ea66",
                    "username":"eeshangarg",
                    "text":"Eeshan Garg"
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: changing_cards_list.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/changing_cards_list.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{  }
   },
   "action":{
      "id":"572a340644ed9c7d8b6f9a30",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "listAfter":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "listBefore":{
            "name":"Basics",
            "id":"53582e2da0fac5676a714279"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"r33ylX2Z",
            "idShort":2,
            "name":"This is a card.",
            "id":"53582e2da0fac5676a71427f",
            "idList":"53582e2da0fac5676a71427a"
         },
         "old":{
            "idList":"53582e2da0fac5676a714279"
         }
      },
      "type":"updateCard",
      "date":"2016-05-04T17:40:22.254Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: changing_description_on_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/changing_description_on_card.json

```json
{
	"model": {
		"id": "55351ade1ed595cfa1bddf81",
		"name": "Welcome Board",
		"desc": "",
		"descData": null,
		"closed": false,
		"idOrganization": null,
		"pinned": false,
		"url": "https://trello.com/b/BDlkcF4E/welcome-board",
		"shortUrl": "https://trello.com/b/BDlkcF4E",
		"prefs": {
			"permissionLevel": "private",
			"voting": "disabled",
			"comments": "members",
			"invitations": "members",
			"selfJoin": true,
			"cardCovers": true,
			"calendarFeedEnabled": false,
			"background": "blue",
			"backgroundImage": null,
			"backgroundImageScaled": null,
			"backgroundTile": false,
			"backgroundBrightness": "dark",
			"backgroundColor": "#0079BF",
			"canBePublic": true,
			"canBeOrg": true,
			"canBePrivate": true,
			"canInvite": true
		},
		"labelNames": {
			"green": "",
			"yellow": "",
			"orange": "",
			"red": "",
			"purple": "",
			"blue": "",
			"sky": "",
			"lime": "",
			"pink": "",
			"black": ""
		}
	},
	"action": {
		"id": "595940dd9907aab7445c3faa",
		"idMemberCreator": "55351ade1ed595cfa1bddf80",
		"data": {
			"list": {
				"name": "List",
				"id": "595940919403b0cd052718c6"
			},
			"board": {
				"shortLink": "BDlkcF4E",
				"name": "Welcome Board",
				"id": "55351ade1ed595cfa1bddf81"
			},
			"card": {
				"shortLink": "P2r0z66z",
				"idShort": 8,
				"name": "New Card",
				"id": "595940ccdd7b429f714ac9f3",
				"desc": "Changed Description"
			},
			"old": {
				"desc": "New Description"
			}
		},
		"type": "updateCard",
		"date": "2017-07-02T18:52:13.184Z",
		"memberCreator": {
			"id": "55351ade1ed595cfa1bddf80",
			"avatarHash": "bcf3f3d2c214f269da2a483abc82524d",
			"fullName": "Marco Matarazzo",
			"initials": "MM",
			"username": "marcomatarazzo1"
		},
		"display": {
			"translationKey": "action_changed_description_of_card",
			"entities": {
				"card": {
					"type": "card",
					"desc": "Changed Description",
					"id": "595940ccdd7b429f714ac9f3",
					"shortLink": "P2r0z66z",
					"text": "New Card"
				},
				"memberCreator": {
					"type": "member",
					"id": "55351ade1ed595cfa1bddf80",
					"username": "marcomatarazzo1",
					"text": "Marco Matarazzo"
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: changing_due_date_on_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/changing_due_date_on_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b71d86efad95cda50c1ff",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "list":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "old":{
            "due":"2016-05-11T10:00:00.000Z"
         },
         "card":{
            "shortLink":"9BduUcVQ",
            "idShort":8,
            "name":"Card name",
            "id":"53582e2da0fac5676a71428b",
            "due":"2016-05-24T10:00:00.000Z"
         }
      },
      "type":"updateCard",
      "date":"2016-05-05T16:16:24.684Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: check_item_on_card_checklist.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/check_item_on_card_checklist.json

```json
{
    "model":{
        "id":"597958d15c95392f2830e9f5",
        "name":"Zulip",
        "desc":"",
        "descData":null,
        "closed":false,
        "idOrganization":null,
        "pinned":false,
        "url":"https://trello.com/b/l9NqJcCd/zulip",
        "shortUrl":"https://trello.com/b/l9NqJcCd",
        "prefs":{
            "permissionLevel":"private",
            "voting":"disabled",
            "comments":"members",
            "invitations":"members",
            "selfJoin":false,
            "cardCovers":true,
            "cardAging":"regular",
            "calendarFeedEnabled":false,
            "background":"blue",
            "backgroundImage":null,
            "backgroundImageScaled":null,
            "backgroundTile":false,
            "backgroundBrightness":"dark",
            "backgroundColor":"#0079BF",
            "backgroundBottomColor":"#0079BF",
            "backgroundTopColor":"#0079BF",
            "canBePublic":true,
            "canBeEnterprise":true,
            "canBeOrg":true,
            "canBePrivate":true,
            "canInvite":true
        },
        "labelNames":{
            "green":"",
            "yellow":"",
            "orange":"",
            "red":"",
            "purple":"",
            "blue":"",
            "sky":"",
            "lime":"",
            "pink":"",
            "black":""
        }
    },
    "action":{
        "id":"5c6f1c2149a22f1567ea1bc1",
        "idMemberCreator":"59780df0f985476615f5ea66",
        "data":{
            "checkItem":{
                "state":"complete",
                "name":"Tomatoes",
                "id":"5c6f1a64af711461f2534921"
            },
            "checklist":{
                "name":"Checklist",
                "id":"5c6f1a58d61c527c91892ba1"
            },
            "card":{
                "shortLink":"R2thJK3P",
                "idShort":3,
                "name":"Something something",
                "id":"5abd0cc638506013c1ebb33f"
            },
            "board":{
                "shortLink":"l9NqJcCd",
                "name":"Zulip",
                "id":"597958d15c95392f2830e9f5"
            }
        },
        "type":"updateCheckItemStateOnCard",
        "date":"2019-02-21T21:46:09.784Z",
        "limits":{

        },
        "display":{
            "translationKey":"action_completed_checkitem",
            "entities":{
                "checkitem":{
                    "type":"checkItem",
                    "nameHtml":"Tomatoes",
                    "id":"5c6f1a64af711461f2534921",
                    "state":"complete",
                    "text":"Tomatoes"
                },
                "card":{
                    "type":"card",
                    "id":"5abd0cc638506013c1ebb33f",
                    "shortLink":"R2thJK3P",
                    "text":"Something something"
                },
                "memberCreator":{
                    "type":"member",
                    "id":"59780df0f985476615f5ea66",
                    "username":"eeshangarg",
                    "text":"Eeshan Garg"
                }
            }
        },
        "memberCreator":{
            "id":"59780df0f985476615f5ea66",
            "avatarHash":null,
            "avatarUrl":null,
            "fullName":"Eeshan Garg",
            "idMemberReferrer":null,
            "initials":"EG",
            "nonPublic":{

            },
            "username":"eeshangarg"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: creating_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/creating_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b84076b9f7ff48a8c6639",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "list":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "card":{
            "shortLink":"5qrgGdD5",
            "idShort":20,
            "name":"New card",
            "id":"572b84076b9f7ff48a8c6638"
         }
      },
      "type":"createCard",
      "date":"2016-05-05T17:33:59.341Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: moving_card_within_single_list.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/moving_card_within_single_list.json

```json
{
    "model":{
        "id":"597958d15c95392f2830e9f5",
        "name":"Zulip",
        "desc":"",
        "descData":null,
        "closed":false,
        "idOrganization":null,
        "pinned":false,
        "url":"https://trello.com/b/l9NqJcCd/zulip",
        "shortUrl":"https://trello.com/b/l9NqJcCd",
        "prefs":{
            "permissionLevel":"private",
            "voting":"disabled",
            "comments":"members",
            "invitations":"members",
            "selfJoin":false,
            "cardCovers":true,
            "cardAging":"regular",
            "calendarFeedEnabled":false,
            "background":"blue",
            "backgroundImage":null,
            "backgroundImageScaled":null,
            "backgroundTile":false,
            "backgroundBrightness":"dark",
            "backgroundColor":"#0079BF",
            "canBePublic":true,
            "canBeOrg":true,
            "canBePrivate":true,
            "canInvite":true
        },
        "labelNames":{
            "green":"",
            "yellow":"",
            "orange":"",
            "red":"",
            "purple":"",
            "blue":"",
            "sky":"",
            "lime":"",
            "pink":"",
            "black":""
        }
    },
    "action":{
        "id":"59795b110565448e01ecb996",
        "idMemberCreator":"59780df0f985476615f5ea66",
        "data":{
            "list":{
                "name":"To Do",
                "id":"597958d15c95392f2830e9f6"
            },
            "board":{
                "shortLink":"l9NqJcCd",
                "name":"Zulip",
                "id":"597958d15c95392f2830e9f5"
            },
            "card":{
                "shortLink":"R9VBNGce",
                "idShort":1,
                "name":"Work on Zulip!",
                "id":"597958df4120dc412438c3c4",
                "pos":196607
            },
            "old":{
                "pos":65535
            }
        },
        "type":"updateCard",
        "date":"2017-07-27T03:16:33.556Z",
        "memberCreator":{
            "id":"59780df0f985476615f5ea66",
            "avatarHash":null,
            "fullName":"Eeshan Garg",
            "initials":"EG",
            "username":"eeshangarg"
        },
        "display":{
            "translationKey":"action_moved_card_higher",
            "entities":{
                "card":{
                    "type":"card",
                    "pos":196607,
                    "id":"597958df4120dc412438c3c4",
                    "shortLink":"R9VBNGce",
                    "text":"Work on Zulip!"
                },
                "memberCreator":{
                    "type":"member",
                    "id":"59780df0f985476615f5ea66",
                    "username":"eeshangarg",
                    "text":"Eeshan Garg"
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: removing_description_from_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/removing_description_from_card.json

```json
{
	"model": {
		"id": "55351ade1ed595cfa1bddf81",
		"name": "Welcome Board",
		"desc": "",
		"descData": null,
		"closed": false,
		"idOrganization": null,
		"pinned": false,
		"url": "https://trello.com/b/BDlkcF4E/welcome-board",
		"shortUrl": "https://trello.com/b/BDlkcF4E",
		"prefs": {
			"permissionLevel": "private",
			"voting": "disabled",
			"comments": "members",
			"invitations": "members",
			"selfJoin": true,
			"cardCovers": true,
			"calendarFeedEnabled": false,
			"background": "blue",
			"backgroundImage": null,
			"backgroundImageScaled": null,
			"backgroundTile": false,
			"backgroundBrightness": "dark",
			"backgroundColor": "#0079BF",
			"canBePublic": true,
			"canBeOrg": true,
			"canBePrivate": true,
			"canInvite": true
		},
		"labelNames": {
			"green": "",
			"yellow": "",
			"orange": "",
			"red": "",
			"purple": "",
			"blue": "",
			"sky": "",
			"lime": "",
			"pink": "",
			"black": ""
		}
	},
	"action": {
		"id": "595940e3153c06dd27fc27a6",
		"idMemberCreator": "55351ade1ed595cfa1bddf80",
		"data": {
			"list": {
				"name": "List",
				"id": "595940919403b0cd052718c6"
			},
			"board": {
				"shortLink": "BDlkcF4E",
				"name": "Welcome Board",
				"id": "55351ade1ed595cfa1bddf81"
			},
			"card": {
				"shortLink": "P2r0z66z",
				"idShort": 8,
				"name": "New Card",
				"id": "595940ccdd7b429f714ac9f3",
				"desc": ""
			},
			"old": {
				"desc": "Changed Description"
			}
		},
		"type": "updateCard",
		"date": "2017-07-02T18:52:19.020Z",
		"memberCreator": {
			"id": "55351ade1ed595cfa1bddf80",
			"avatarHash": "bcf3f3d2c214f269da2a483abc82524d",
			"fullName": "Marco Matarazzo",
			"initials": "MM",
			"username": "marcomatarazzo1"
		},
		"display": {
			"translationKey": "action_changed_description_of_card",
			"entities": {
				"card": {
					"type": "card",
					"desc": "",
					"id": "595940ccdd7b429f714ac9f3",
					"shortLink": "P2r0z66z",
					"text": "New Card"
				},
				"memberCreator": {
					"type": "member",
					"id": "55351ade1ed595cfa1bddf80",
					"username": "marcomatarazzo1",
					"text": "Marco Matarazzo"
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: removing_due_date_from_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/removing_due_date_from_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b721625d61ac1a5592497",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "list":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "old":{
            "due":"2016-05-24T10:00:00.000Z"
         },
         "card":{
            "shortLink":"9BduUcVQ",
            "idShort":8,
            "name":"Card name",
            "id":"53582e2da0fac5676a71428b",
            "due":null
         }
      },
      "type":"updateCard",
      "date":"2016-05-05T16:17:26.908Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: removing_label_from_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/removing_label_from_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b903acadd8176647a1c8d",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "label":{
            "color":"green",
            "name":"",
            "id":"54642de974d650d56763bc32"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"r33ylX2Z",
            "idShort":2,
            "name":"New Card",
            "id":"53582e2da0fac5676a71427f"
         },
         "text":"text value",
         "value":"green"
      },
      "type":"removeLabelFromCard",
      "date":"2016-05-05T18:26:02.307Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: removing_member_from_board.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/removing_member_from_board.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"57359c57e337352c531efaa8",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "deactivated":false,
         "idMember":"4e6a7fad05d98b02ba00845c"
      },
      "type":"removeMemberFromBoard",
      "date":"2016-05-13T09:20:23.166Z",
      "member":{
         "id":"4e6a7fad05d98b02ba00845c",
         "avatarHash":"a6cc37f6849928acb91064cf65e61cbc",
         "fullName":"Trello",
         "initials":"T",
         "username":"trello"
      },
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: removing_member_from_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/removing_member_from_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b6d154f004c5cccc0d8f1",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"9BduUcVQ",
            "idShort":8,
            "name":"Card name",
            "id":"53582e2da0fac5676a71428b"
         },
         "deactivated":false,
         "idMember":"4e6a7fad05d98b02ba00845c"
      },
      "type":"removeMemberFromCard",
      "date":"2016-05-05T15:56:05.991Z",
      "member":{
         "id":"4e6a7fad05d98b02ba00845c",
         "avatarHash":"a6cc37f6849928acb91064cf65e61cbc",
         "fullName":"Trello",
         "initials":"T",
         "username":"trello"
      },
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: renaming_board.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/renaming_board.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"New name",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/new-name",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"5735c14e8cf95868089df00a",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "board":{
            "shortLink":"iqXXzYEj",
            "id":"53582e2da0fac5676a714277",
            "name":"New name"
         },
         "old":{
            "name":"Welcome Board"
         }
      },
      "type":"updateBoard",
      "date":"2016-05-13T11:58:06.045Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: renaming_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/renaming_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572a36f33c7ab8948bab8064",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "list":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"r33ylX2Z",
            "idShort":2,
            "id":"53582e2da0fac5676a71427f",
            "name":"New name"
         },
         "old":{
            "name":"Old name"
         }
      },
      "type":"updateCard",
      "date":"2016-05-04T17:52:51.098Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: reopening_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/reopening_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b7a8b7ef0703562559b3a",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "list":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "card":{
            "shortLink":"9BduUcVQ",
            "idShort":8,
            "name":"Card name",
            "id":"53582e2da0fac5676a71428b",
            "closed":false
         },
         "old":{
            "closed":true
         }
      },
      "type":"updateCard",
      "date":"2016-05-05T16:53:31.423Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

````
