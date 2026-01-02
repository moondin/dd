---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1081
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1081 of 1290)

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

---[FILE: export.json]---
Location: zulip-main/zerver/tests/fixtures/mattermost_fixtures/direct_channel/export.json

```json
{"type":"version","version":1}
{"type":"team","team":{"name":"gryffindor","display_name":"Gryffindor","type":"O","description":"","allow_open_invite":true}}
{"type":"channel","channel":{"team":"gryffindor","name":"gryffindor-common-room","display_name":"Gryffindor common room","type":"O","header":"","purpose":"A place for talking about Gryffindor common room"}}
{"type":"channel","channel":{"team":"gryffindor","name":"gryffindor-quidditch-team","display_name":"Gryffindor quidditch team","type":"O","header":"","purpose":"A place for talking about Gryffindor quidditch team"}}
{"type":"channel","channel":{"team":"gryffindor","name":"dumbledores-army","display_name":"Dumbledores army","type":"P","header":"https//:github.com/zulip/zulip","purpose":"A place for talking about Dumbledores army"}}
{"type":"user","user":{"username":"ginny","email":"ginny@zulip.com","auth_service":"","nickname":"","first_name":"Ginny","last_name":"Weasley","position":"","roles":"system_user","locale":"en","teams":[{"name":"gryffindor","roles":"team_user","channels":[{"name":"gryffindor-quidditch-team","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-common-room","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"dumbledores-army","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"ginny,@ginny"}}}
{"type":"user","user":{"username":"ron","email":"ron@zulip.com","auth_service":"","nickname":"","first_name":"Ron","last_name":"Weasley","position":"","roles":"system_user","locale":"en","teams":[{"name":"gryffindor","roles":"team_user","channels":[{"name":"gryffindor-quidditch-team","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-common-room","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"dumbledores-army","roles":"channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"ron,@ron"}}}
{"type":"user","user":{"username":"harry","email":"harry@zulip.com","auth_service":"","nickname":"","first_name":"Harry","last_name":"Potter","position":"","roles":"system_admin system_user","locale":"en","teams":[{"name":"gryffindor","roles":"team_admin team_user","channels":[{"name":"dumbledores-army","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-common-room","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false},{"name":"gryffindor-quidditch-team","roles":"channel_admin channel_user","notify_props":{"desktop":"default","mobile":"default","mark_unread":"all"},"favorite":false}]}],"notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"harry,@harry"}}}
{"type":"user","user":{"username":"voldemort","email":"voldemort@zulip.com","auth_service":"","nickname":"","first_name":"Tom","last_name":"Riddle","position":"","roles":"system_admin system_user","locale":"en","teams":null, "notify_props":{"desktop":"mention","desktop_sound":"true","email":"true","mobile":"mention","mobile_push_status":"away","channel":"true","comments":"never","mention_keys":"harry,@harry"}}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"ron","message":"ron joined the channel.","create_at":1553166512493,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"ron","message":"Hey folks","create_at":1553166519720,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-quidditch-team","user":"harry","message":"@ron Welcome mate!","create_at":1553166519726,"reactions":null,"replies":null}}
{"type":"post","post":{"team":"gryffindor","channel":"gryffindor-common-room","user":"harry","message":"Looks like this channel is empty","create_at":1553166567370,"reactions":[{"user":"ron","create_at":1553166584976,"emoji_name":"rocket"}],"replies":null,"attachments":[{"path":"20210622/teams/noteam/channels/mcrm7xee5bnpzn7u9ktsd91dwy/users/knq189b88fdxbdkeeasdynia4o/smaa5epsnp89tgjszzue1691ao/this is a file"}]}}
{"type":"direct_channel","direct_channel":{"members":["ron","harry"],"favorited_by":null,"header":""}}
{"type":"direct_channel","direct_channel":{"members":["ron","harry", "ginny"],"favorited_by":null,"header":""}}
{"type":"direct_channel","direct_channel":{"members":["harry","ron", "ginny"],"favorited_by":null,"header":""}}
{"type":"direct_channel","direct_channel":{"members":["harry","voldemort"],"favorited_by":null,"header":""}}
{"type":"direct_post","direct_post":{"channel_members":["ron","harry"],"user":"ron","message":"hey harry","create_at":1566376137676,"flagged_by":null,"reactions":null,"replies":null,"attachments":[{"path":"20210622/teams/noteam/channels/mcrm7xee5bnpzn7u9ktsd91dwy/users/knq189b88fdxbdkeeasdynia4o/o3to4ezua3bajj31mzpkn96n5e/harry-ron.jpg"}]}}
{"type":"direct_post","direct_post":{"channel_members":["ron","harry"],"user":"harry","message":"what's up","create_at":1566376318568,"flagged_by":null,"reactions":null,"replies":null,"attachments":null}}
{"type":"direct_post","direct_post":{"channel_members":["ron","harry","ginny"],"user":"ginny","message":"Who is going to Hogsmeade this weekend?","create_at":1566376226493,"flagged_by":null,"reactions":null,"replies":null,"attachments":null}}
{"type":"direct_post","direct_post":{"channel_members":["ron","harry","ginny"],"user":"harry","message":"\u0000\u0001\u0001Hello How Are you\u0001\u0000\u0000\u0000\u0000","create_at":1566376311350,"flagged_by":null,"reactions":null,"replies":null,"attachments":null}}
{"type":"direct_post","direct_post":{"channel_members":["ron","harry","ginny"],"user":"ron","message":"I am going as well","create_at":1566376286363,"flagged_by":null,"reactions":null,"replies":null,"attachments":null}}
{"type":"direct_post","direct_post":{"channel_members":["harry","voldemort"],"user":"voldemort","message":"Hey Harry.","create_at":1566376318569,"flagged_by":null,"reactions":null,"replies":null,"attachments":null}}
{"type":"direct_post","direct_post":{"channel_members":["harry","voldemort"],"user":"harry","message":"Ahh. Here we go again.","create_at":1566376318579,"flagged_by":null,"reactions":null,"replies":null,"attachments":null}}
```

--------------------------------------------------------------------------------

---[FILE: directory_roles.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_graph_api_response_fixtures/directory_roles.json

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryRoles",
    "value": [
        {
            "id": "240d3723-f4d5-4e70-aa3b-2e574c4f6ea3",
            "deletedDateTime": null,
            "description": "Can manage all aspects of Microsoft Entra ID and Microsoft services that use Microsoft Entra identities.",
            "displayName": "Global Administrator",
            "roleTemplateId": "62e90394-69f5-4237-9190-012177145e10"
        },
        {
            "id": "28356285-b6a8-4c23-ada1-f68dc07a826b",
            "deletedDateTime": null,
            "description": "Can manage all aspects of the Exchange product.",
            "displayName": "Exchange Administrator",
            "roleTemplateId": "29232cdf-9323-42fd-ade2-1d097af3e4de"
        },
        {
            "id": "4574a009-f705-49c5-bab1-b1f14682c631",
            "deletedDateTime": null,
            "description": "Can manage all aspects of the SharePoint service.",
            "displayName": "SharePoint Administrator",
            "roleTemplateId": "f28a1f50-f6e7-4571-818b-6a12f2af6b6c"
        },
        {
            "id": "68c4bac3-df9b-4dd7-ba8e-380fb5c065b7",
            "deletedDateTime": null,
            "description": "Can perform common billing related tasks like updating payment information.",
            "displayName": "Billing Administrator",
            "roleTemplateId": "b0f54661-2d74-4c50-afa3-1ec803f12efe"
        },
        {
            "id": "82bb9c5f-0911-40c1-ab29-944262f9835e",
            "deletedDateTime": null,
            "description": "Can manage the Microsoft Teams service.",
            "displayName": "Teams Administrator",
            "roleTemplateId": "69091246-20e8-4a56-aa4d-066075b2a7a8"
        },
        {
            "id": "b2dfd9f5-106f-4410-a400-a1be2a43741e",
            "deletedDateTime": null,
            "description": "Can manage all aspects of users and groups, including resetting passwords for limited admins.",
            "displayName": "User Administrator",
            "roleTemplateId": "fe930be7-5e62-47db-91af-98c3a49a38b1"
        },
        {
            "id": "bf811cd7-8f47-450a-8dfb-70af1e523829",
            "deletedDateTime": null,
            "description": "Can read service health information and manage support tickets.",
            "displayName": "Service Support Administrator",
            "roleTemplateId": "f023fd81-a637-4b56-95fd-791ac0226033"
        },
        {
            "id": "d94becae-0962-4437-b10a-6fd56dd822af",
            "deletedDateTime": null,
            "description": "Can reset passwords for non-administrators and Helpdesk Administrators.",
            "displayName": "Helpdesk Administrator",
            "roleTemplateId": "729827e3-9c14-49f7-bb1b-9608f156bbb8"
        },
        {
            "id": "f65976b3-a936-4ed4-88b2-ec5987bbe19f",
            "deletedDateTime": null,
            "description": "Can read everything that a Global Administrator can, but not update anything.",
            "displayName": "Global Reader",
            "roleTemplateId": "f2ef992c-3afb-46b9-b7cf-a126ee74c451"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: directory_roles_global_administrator_members.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_graph_api_response_fixtures/directory_roles_global_administrator_members.json

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryObjects",
  "value": [
    {
      "@odata.type": "#microsoft.graph.user",
      "id": "3c6ee395-529d-4681-b5f7-582c707570f6",
      "businessPhones": [
        "16508158245"
      ],
      "displayName": "Alya Abbott",
      "givenName": "Alya",
      "jobTitle": null,
      "mail": "alya@ZulipChat.onmicrosoft.com",
      "mobilePhone": null,
      "officeLocation": null,
      "preferredLanguage": "en",
      "surname": "Abbott",
      "userPrincipalName": "alya@ZulipChat.onmicrosoft.com"
    },
    {
      "@odata.type": "#microsoft.graph.user",
      "id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
      "businessPhones": [],
      "displayName": "Pieter K",
      "givenName": "Pieter",
      "jobTitle": null,
      "mail": "pieterk@ZulipChat.onmicrosoft.com",
      "mobilePhone": null,
      "officeLocation": null,
      "preferredLanguage": null,
      "surname": "K",
      "userPrincipalName": "pieterk@ZulipChat.onmicrosoft.com"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: paginated_users_member.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_graph_api_response_fixtures/paginated_users_member.json

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users",
    "@odata.nextLink": "https://graph.microsoft.com/v1.0/users?$filter=userType+eq+%27Member%27&$top=3&$skiptoken=RFNwdAoAAQAAAAAAAAAAFAAAAAIjPrZtIj1IsyACv_n3ZLsBAAAAAAAAAAAAAAAAAAAXMS4yLjg0MC4xMTM1NTYuMS40LjIzMzEGAAAAAAABttbVt5Wq-0aI2xDyNlaWGwG9AAAAAQAAAAA",
    "value": [
        {
            "businessPhones": [
                "16508158245"
            ],
            "displayName": "Alya Abbott",
            "givenName": "Alya",
            "jobTitle": null,
            "mail": "alya@ZulipChat.onmicrosoft.com",
            "mobilePhone": null,
            "officeLocation": null,
            "preferredLanguage": "en",
            "surname": "Abbott",
            "userPrincipalName": "alya@ZulipChat.onmicrosoft.com",
            "id": "3c6ee395-529d-4681-b5f7-582c707570f6"
        },
        {
            "businessPhones": [],
            "displayName": "Pieter K",
            "givenName": "Pieter",
            "jobTitle": null,
            "mail": "pieterk@ZulipChat.onmicrosoft.com",
            "mobilePhone": null,
            "officeLocation": null,
            "preferredLanguage": null,
            "surname": "K",
            "userPrincipalName": "pieterk@ZulipChat.onmicrosoft.com",
            "id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9"
        },
        {
            "businessPhones": [],
            "displayName": "Cordelia",
            "givenName": "Cordelia",
            "jobTitle": null,
            "mail": "cordelia@ZulipChat.onmicrosoft.com",
            "mobilePhone": null,
            "officeLocation": null,
            "preferredLanguage": null,
            "surname": null,
            "userPrincipalName": "cordelia@ZulipChat.onmicrosoft.com",
            "id": "bcbf26d8-e24a-4298-b6fd-d2320ff09fa5"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: paginated_users_member_2.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_graph_api_response_fixtures/paginated_users_member_2.json

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users",
    "value": [
        {
            "businessPhones": [],
            "displayName": "zoe",
            "givenName": "zoe",
            "jobTitle": null,
            "mail": "zoe@ZulipChat.onmicrosoft.com",
            "mobilePhone": null,
            "officeLocation": null,
            "preferredLanguage": null,
            "surname": null,
            "userPrincipalName": "zoe@ZulipChat.onmicrosoft.com",
            "id": "5dbe468a-1e96-4aaa-856d-cdf825081e11"
        },
        {
            "businessPhones": [],
            "displayName": "AARON",
            "givenName": "AARON",
            "jobTitle": "Business development specialist",
            "mail": "aaron@ZulipChat.onmicrosoft.com",
            "mobilePhone": null,
            "officeLocation": null,
            "preferredLanguage": null,
            "surname": null,
            "userPrincipalName": "aaron@ZulipChat.onmicrosoft.com",
            "id": "4dbd4c6f-163d-40b7-901b-e86b2f2141ae"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: users_guest.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_graph_api_response_fixtures/users_guest.json

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users",
    "value": [
        {
            "displayName": "Guest guy",
            "mail": "guest@example.com",
            "id": "16741626-4cd8-46cc-bf36-42ecc2b5fdce"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: questionsAndAnswers.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_teams_fixtures/TeamsData_ZulipChat/meetings/questionsAndAnswers.json

```json
[]
```

--------------------------------------------------------------------------------

---[FILE: teamsList.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_teams_fixtures/TeamsData_ZulipChat/teams/teamsList.json

```json
[
  {
    "Name": "Community",
    "Privacy": "Public",
    "Description": "social, general discussion, new members",
    "Classification": null,
    "GroupsId": "002145f2-eaba-4962-997d-6d841a9f50af",
    "ExpirationDate": null,
    "TeamMembers": null,
    "Owners": null,
    "Guests": null,
    "StandardChannels": 0,
    "PrivateChannels": 0,
    "SharedChannels": 0,
    "Status": null,
    "AssignedLabels": null
  },
  {
    "Name": "Kandra Labs",
    "Privacy": "Public",
    "Description": "Kandra Labs",
    "Classification": null,
    "GroupsId": "1d513e46-d8cd-41db-b84f-381fe5730794",
    "ExpirationDate": null,
    "TeamMembers": null,
    "Owners": null,
    "Guests": null,
    "StandardChannels": 0,
    "PrivateChannels": 0,
    "SharedChannels": 0,
    "Status": null,
    "AssignedLabels": null
  },
  {
    "Name": "Contributors",
    "Privacy": "Public",
    "Description": "Contributors",
    "Classification": null,
    "GroupsId": "2a00a70a-00f5-4da5-8618-8281194f0de0",
    "ExpirationDate": null,
    "TeamMembers": null,
    "Owners": null,
    "Guests": null,
    "StandardChannels": 0,
    "PrivateChannels": 0,
    "SharedChannels": 0,
    "Status": null,
    "AssignedLabels": null
  },
  {
    "Name": "Feedback \u0026 support",
    "Privacy": "Public",
    "Description": "feedback, issues, production help, etc",
    "Classification": null,
    "GroupsId": "5e5f1988-3216-4ca0-83e9-18c04ecc7533",
    "ExpirationDate": null,
    "TeamMembers": null,
    "Owners": null,
    "Guests": null,
    "StandardChannels": 0,
    "PrivateChannels": 0,
    "SharedChannels": 0,
    "Status": null,
    "AssignedLabels": null
  },
  {
    "Name": "Core team",
    "Privacy": "Private",
    "Description": "Private team",
    "Classification": null,
    "GroupsId": "7c050abd-3cbb-448b-a9de-405f54cc14b2",
    "ExpirationDate": null,
    "TeamMembers": null,
    "Owners": null,
    "Guests": null,
    "StandardChannels": 0,
    "PrivateChannels": 0,
    "SharedChannels": 0,
    "Status": null,
    "AssignedLabels": null
  },
  {
    "Name": "All Company",
    "Privacy": "Public",
    "Description": "This is the default group for everyone in the network",
    "Classification": null,
    "GroupsId": "bd97798a-858b-4973-956b-587670b2612a",
    "ExpirationDate": null,
    "TeamMembers": null,
    "Owners": null,
    "Guests": null,
    "StandardChannels": 0,
    "PrivateChannels": 0,
    "SharedChannels": 0,
    "Status": null,
    "AssignedLabels": null
  }
]
```

--------------------------------------------------------------------------------

---[FILE: teamsSettings.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_teams_fixtures/TeamsData_ZulipChat/teams/teamsSettings.json

```json
[
  {
    "Id": "1d513e46-d8cd-41db-b84f-381fe5730794",
    "DisplayName": "Kandra Labs",
    "InternalId": "19:vYdeQme8PVAnebTgrsgGoC-zluWAfK5Gx_VNtSrLzjQ1@thread.tacv2",
    "Visibility": "public",
    "IsArchived": false,
    "IsMembershipLimitedToOwners": false,
    "MemberSettings": {
      "AllowCreateUpdateChannels": true,
      "AllowDeleteChannels": true,
      "AllowAddRemoveApps": true,
      "AllowCreateUpdateRemoveTabs": true,
      "AllowCreateUpdateRemoveConnectors": true
    },
    "GuestSettings": {
      "AllowCreateUpdateChannels": false,
      "AllowDeleteChannels": false
    },
    "MessagingSettings": {
      "AllowUserEditMessages": true,
      "AllowUserDeleteMessages": true,
      "AllowOwnerDeleteMessages": true,
      "AllowTeamMentions": true,
      "AllowChannelMentions": true
    },
    "FunSettings": {
      "AllowGiphy": true,
      "GiphyContentRating": "moderate",
      "AllowStickersAndMemes": true,
      "AllowCustomMemes": true
    },
    "DiscoverySettings": { "ShowInTeamsSearchAndSuggestions": true },
    "Summary": { "OwnersCount": "2", "MembersCount": "5", "GuestsCount": "1" }
  },
  {
    "Id": "2a00a70a-00f5-4da5-8618-8281194f0de0",
    "DisplayName": "Contributors",
    "InternalId": "19:5XdBvtvU2IDCRqIjaamUL7C6eU3n3ZZSK4F1aOj1sq81@thread.tacv2",
    "Visibility": "public",
    "IsArchived": false,
    "IsMembershipLimitedToOwners": false,
    "MemberSettings": {
      "AllowCreateUpdateChannels": true,
      "AllowDeleteChannels": true,
      "AllowAddRemoveApps": true,
      "AllowCreateUpdateRemoveTabs": true,
      "AllowCreateUpdateRemoveConnectors": true
    },
    "GuestSettings": {
      "AllowCreateUpdateChannels": false,
      "AllowDeleteChannels": false
    },
    "MessagingSettings": {
      "AllowUserEditMessages": true,
      "AllowUserDeleteMessages": true,
      "AllowOwnerDeleteMessages": true,
      "AllowTeamMentions": true,
      "AllowChannelMentions": true
    },
    "FunSettings": {
      "AllowGiphy": true,
      "GiphyContentRating": "moderate",
      "AllowStickersAndMemes": true,
      "AllowCustomMemes": true
    },
    "DiscoverySettings": { "ShowInTeamsSearchAndSuggestions": true },
    "Summary": { "OwnersCount": "2", "MembersCount": "5", "GuestsCount": "1" }
  },
  {
    "Id": "002145f2-eaba-4962-997d-6d841a9f50af",
    "DisplayName": "Community",
    "InternalId": "19:9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1@thread.tacv2",
    "Visibility": "public",
    "IsArchived": false,
    "IsMembershipLimitedToOwners": false,
    "MemberSettings": {
      "AllowCreateUpdateChannels": true,
      "AllowDeleteChannels": true,
      "AllowAddRemoveApps": true,
      "AllowCreateUpdateRemoveTabs": true,
      "AllowCreateUpdateRemoveConnectors": true
    },
    "GuestSettings": {
      "AllowCreateUpdateChannels": false,
      "AllowDeleteChannels": false
    },
    "MessagingSettings": {
      "AllowUserEditMessages": true,
      "AllowUserDeleteMessages": true,
      "AllowOwnerDeleteMessages": true,
      "AllowTeamMentions": true,
      "AllowChannelMentions": true
    },
    "FunSettings": {
      "AllowGiphy": true,
      "GiphyContentRating": "moderate",
      "AllowStickersAndMemes": true,
      "AllowCustomMemes": true
    },
    "DiscoverySettings": { "ShowInTeamsSearchAndSuggestions": true },
    "Summary": { "OwnersCount": "1", "MembersCount": "1", "GuestsCount": "1" }
  },
  {
    "Id": "5e5f1988-3216-4ca0-83e9-18c04ecc7533",
    "DisplayName": "Feedback \u0026 support",
    "InternalId": "19:7uc_EBehLl61DKDNpHx_8XDMdCv40Vq7_C9LFG9tLIM1@thread.tacv2",
    "Visibility": "public",
    "IsArchived": false,
    "IsMembershipLimitedToOwners": false,
    "MemberSettings": {
      "AllowCreateUpdateChannels": true,
      "AllowDeleteChannels": true,
      "AllowAddRemoveApps": true,
      "AllowCreateUpdateRemoveTabs": true,
      "AllowCreateUpdateRemoveConnectors": true
    },
    "GuestSettings": {
      "AllowCreateUpdateChannels": false,
      "AllowDeleteChannels": false
    },
    "MessagingSettings": {
      "AllowUserEditMessages": true,
      "AllowUserDeleteMessages": true,
      "AllowOwnerDeleteMessages": true,
      "AllowTeamMentions": true,
      "AllowChannelMentions": true
    },
    "FunSettings": {
      "AllowGiphy": true,
      "GiphyContentRating": "moderate",
      "AllowStickersAndMemes": true,
      "AllowCustomMemes": true
    },
    "DiscoverySettings": { "ShowInTeamsSearchAndSuggestions": true },
    "Summary": { "OwnersCount": "1", "MembersCount": "1", "GuestsCount": "1" }
  },
  {
    "Id": "7c050abd-3cbb-448b-a9de-405f54cc14b2",
    "DisplayName": "Core team",
    "InternalId": "19:---2pcguZ0vbfte2wmk0y31xdnjlFv2C1k7nyYXUc7A1@thread.tacv2",
    "Visibility": "private",
    "IsArchived": false,
    "IsMembershipLimitedToOwners": false,
    "MemberSettings": {
      "AllowCreateUpdateChannels": true,
      "AllowDeleteChannels": true,
      "AllowAddRemoveApps": true,
      "AllowCreateUpdateRemoveTabs": true,
      "AllowCreateUpdateRemoveConnectors": true
    },
    "GuestSettings": {
      "AllowCreateUpdateChannels": false,
      "AllowDeleteChannels": false
    },
    "MessagingSettings": {
      "AllowUserEditMessages": true,
      "AllowUserDeleteMessages": true,
      "AllowOwnerDeleteMessages": true,
      "AllowTeamMentions": true,
      "AllowChannelMentions": true
    },
    "FunSettings": {
      "AllowGiphy": true,
      "GiphyContentRating": "moderate",
      "AllowStickersAndMemes": true,
      "AllowCustomMemes": true
    },
    "DiscoverySettings": { "ShowInTeamsSearchAndSuggestions": false },
    "Summary": { "OwnersCount": "1", "MembersCount": "2", "GuestsCount": "1" }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: channels_002145f2-eaba-4962-997d-6d841a9f50af.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_teams_fixtures/TeamsData_ZulipChat/teams/002145f2-eaba-4962-997d-6d841a9f50af/channels_002145f2-eaba-4962-997d-6d841a9f50af.json

```json
[
  {
    "Id": "19:9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1@thread.tacv2",
    "CreatedDateTime": "2025-08-12T06:52:14.885Z",
    "DisplayName": "General",
    "Description": "social, general discussion, new members",
    "IsFavoriteByDefault": null,
    "Email": "Community@ZulipChat.onmicrosoft.com",
    "TenantId": "af4acab6-6476-4c2f-bef2-ff6479dd3940",
    "WebUrl": "https://teams.cloud.microsoft/l/channel/19%3A9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1%40thread.tacv2/Community?groupId=002145f2-eaba-4962-997d-6d841a9f50af\u0026tenantId=af4acab6-6476-4c2f-bef2-ff6479dd3940\u0026allowXTenantAccess=True\u0026ngc=True",
    "MembershipType": "standard",
    "IsArchived": false
  }
]
```

--------------------------------------------------------------------------------

---[FILE: groupEvents_002145f2-eaba-4962-997d-6d841a9f50af.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_teams_fixtures/TeamsData_ZulipChat/teams/002145f2-eaba-4962-997d-6d841a9f50af/groupEvents_002145f2-eaba-4962-997d-6d841a9f50af.json

```json
[]
```

--------------------------------------------------------------------------------

---[FILE: messages_002145f2-eaba-4962-997d-6d841a9f50af.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_teams_fixtures/TeamsData_ZulipChat/teams/002145f2-eaba-4962-997d-6d841a9f50af/messages_002145f2-eaba-4962-997d-6d841a9f50af.json

```json
[
  {
    "Id": "1759320958611",
    "Body": {
      "ContentType": "html",
      "Content": "\u003Cp\u003E\u003Cspan\u003E\u003Ccustomemoji id=\u0022MC13dXMtZDEtZWMzY2I4NmY3MmM5YzBjNGJlMjE2Zjk3MTM1MDZkNTQ=\u0022 alt=\u0022notif-bot\u0022 source=\u0022https://graph.microsoft.com/v1.0/teams/002145f2-eaba-4962-997d-6d841a9f50af/channels/19:9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1@thread.tacv2/messages/1759320958611/hostedContents/aWQ9LHR5cGU9MSx1cmw9aHR0cHM6Ly91cy1wcm9kLmFzeW5jZ3cudGVhbXMubWljcm9zb2Z0LmNvbS92MS9vYmplY3RzLzAtd3VzLWQxLWVjM2NiODZmNzJjOWMwYzRiZTIxNmY5NzEzNTA2ZDU0L3ZpZXdzL2ltZ3QyX2FuaW0=/$value\u0022\u003E\u003C/customemoji\u003E\u003C/span\u003E\u003Cspan\u003E\u003Ccustomemoji id=\u0022MC13dXMtZDItMWNmOWZmOGQ2OTFiOGM5ZjExYzhhM2ZhMzJiMzFlMDU=\u0022 alt=\u0022zlp-logo\u0022 source=\u0022https://graph.microsoft.com/v1.0/teams/002145f2-eaba-4962-997d-6d841a9f50af/channels/19:9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1@thread.tacv2/messages/1759320958611/hostedContents/aWQ9LHR5cGU9MSx1cmw9aHR0cHM6Ly91cy1wcm9kLmFzeW5jZ3cudGVhbXMubWljcm9zb2Z0LmNvbS92MS9vYmplY3RzLzAtd3VzLWQyLTFjZjlmZjhkNjkxYjhjOWYxMWM4YTNmYTMyYjMxZTA1L3ZpZXdzL2ltZ3QyX2FuaW0=/$value\u0022\u003E\u003C/customemoji\u003E\u003C/span\u003E\u003C/p\u003E"
    },
    "CreatedDateTime": "2025-10-01T12:15:58.611+00:00",
    "LastModifiedDateTime": "2025-10-13T06:41:52+00:00",
    "LastEditedDateTime": null,
    "DeletedDateTime": null,
    "Subject": "Custom emojis",
    "Summary": null,
    "Importance": "normal",
    "Locale": "en-us",
    "PolicyViolation": null,
    "ReplyToId": null,
    "WebUrl": "https://teams.microsoft.com/l/message/19%3A9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1%40thread.tacv2/1759320958611?groupId=002145f2-eaba-4962-997d-6d841a9f50af\u0026tenantId=af4acab6-6476-4c2f-bef2-ff6479dd3940\u0026createdTime=1759320958611\u0026parentMessageId=1759320958611",
    "From": {
      "Application": null,
      "Device": null,
      "User": {
        "Id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
        "DisplayName": "Pieter K",
        "UserIdentityType": "aadUser",
        "TenantId": "af4acab6-6476-4c2f-bef2-ff6479dd3940"
      }
    },
    "Attachments": [],
    "Mentions": [],
    "Reactions": [
      {
        "CreatedDateTime": "2025-10-13T06:41:47+00:00",
        "ReactionType": "custom",
        "User": {
          "Application": null,
          "Device": null,
          "User": {
            "DisplayName": "Pieter K",
            "Id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
            "TenantId": "af4acab6-6476-4c2f-bef2-ff6479dd3940",
            "Thumbnails": null
          }
        }
      },
      {
        "CreatedDateTime": "2025-10-13T06:41:52+00:00",
        "ReactionType": "custom",
        "User": {
          "Application": null,
          "Device": null,
          "User": {
            "DisplayName": "Pieter K",
            "Id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
            "TenantId": "af4acab6-6476-4c2f-bef2-ff6479dd3940",
            "Thumbnails": null
          }
        }
      }
    ],
    "MessageHistory": [
      {
        "ModifiedDateTime": "2025-10-13T06:41:47+00:00",
        "Actions": "reactionAdded",
        "Reaction": {
          "CreatedDateTime": "2025-10-13T06:41:47+00:00",
          "ReactionType": "custom",
          "User": {
            "Application": null,
            "Device": null,
            "User": {
              "DisplayName": "Pieter K",
              "Id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
              "TenantId": null,
              "Thumbnails": null
            }
          }
        }
      },
      {
        "ModifiedDateTime": "2025-10-13T06:41:52+00:00",
        "Actions": "reactionAdded",
        "Reaction": {
          "CreatedDateTime": "2025-10-13T06:41:52+00:00",
          "ReactionType": "custom",
          "User": {
            "Application": null,
            "Device": null,
            "User": {
              "DisplayName": "Pieter K",
              "Id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
              "TenantId": null,
              "Thumbnails": null
            }
          }
        }
      }
    ],
    "MessageType": "message",
    "ChannelIdentity": {
      "ChannelId": "19:9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1@thread.tacv2",
      "TeamId": "002145f2-eaba-4962-997d-6d841a9f50af"
    },
    "ChatId": null,
    "EventDetail": null
  },
  {
    "Id": "1760338105757",
    "Body": {
      "ContentType": "html",
      "Content": "\u003Cattachment id=\u002280b1e5a8-fc12-470f-a4b5-190069bebaa8\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u00225aface0d-d71d-4a5a-bee5-d3082edd3976\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u00223faa6aed-2634-4ebd-9bb9-fc79836d6f08\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u00225ea01d8e-599d-4609-9d65-8d0733db2c51\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u0022a78c77d3-671e-4173-9e35-09c74fda550f\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u0022839b3a3d-7943-4597-9af0-1e387cd03fad\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u002200a9384b-94e7-43d2-807a-8f17507f6c88\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u0022838aa8a1-23b7-4d8f-8aa0-415d127f58e7\u0022\u003E\u003C/attachment\u003E\u003Cattachment id=\u00220a65056d-3d25-47e3-bb1b-4cb3151086be\u0022\u003E\u003C/attachment\u003E"
    },
    "CreatedDateTime": "2025-10-13T06:48:25.757+00:00",
    "LastModifiedDateTime": "2025-10-13T06:48:25.757+00:00",
    "LastEditedDateTime": null,
    "DeletedDateTime": null,
    "Subject": "File objects",
    "Summary": null,
    "Importance": "normal",
    "Locale": "en-us",
    "PolicyViolation": null,
    "ReplyToId": null,
    "WebUrl": "https://teams.microsoft.com/l/message/19%3A9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1%40thread.tacv2/1760338105757?groupId=002145f2-eaba-4962-997d-6d841a9f50af\u0026tenantId=af4acab6-6476-4c2f-bef2-ff6479dd3940\u0026createdTime=1760338105757\u0026parentMessageId=1760338105757",
    "From": {
      "Application": null,
      "Device": null,
      "User": {
        "Id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
        "DisplayName": "Pieter K",
        "UserIdentityType": "aadUser",
        "TenantId": "af4acab6-6476-4c2f-bef2-ff6479dd3940"
      }
    },
    "Attachments": [
      {
        "Id": "80b1e5a8-fc12-470f-a4b5-190069bebaa8",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/wp12245700.jpg",
        "Content": null,
        "Name": "wp12245700.jpg",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "5aface0d-d71d-4a5a-bee5-d3082edd3976",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/zlp_logo.png",
        "Content": null,
        "Name": "zlp_logo.png",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "3faa6aed-2634-4ebd-9bb9-fc79836d6f08",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/zulip-export-j8zps83t.tar.gz",
        "Content": null,
        "Name": "zulip-export-j8zps83t.tar.gz",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "5ea01d8e-599d-4609-9d65-8d0733db2c51",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/TeamsData2025-10-09.zip",
        "Content": null,
        "Name": "TeamsData2025-10-09.zip",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "a78c77d3-671e-4173-9e35-09c74fda550f",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/usersList.json",
        "Content": null,
        "Name": "usersList.json",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "839b3a3d-7943-4597-9af0-1e387cd03fad",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/Hashing.xlsx",
        "Content": null,
        "Name": "Hashing.xlsx",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "00a9384b-94e7-43d2-807a-8f17507f6c88",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/Untitled document.txt",
        "Content": null,
        "Name": "Untitled document.txt",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "838aa8a1-23b7-4d8f-8aa0-415d127f58e7",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/Untitled document.pdf",
        "Content": null,
        "Name": "Untitled document.pdf",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      },
      {
        "Id": "0a65056d-3d25-47e3-bb1b-4cb3151086be",
        "ContentType": "reference",
        "ContentUrl": "https://zulipchat.sharepoint.com/sites/Community/Shared Documents/General/Untitled document.docx",
        "Content": null,
        "Name": "Untitled document.docx",
        "ThumbnailUrl": null,
        "TeamsAppId": null
      }
    ],
    "Mentions": [],
    "Reactions": [],
    "MessageHistory": null,
    "MessageType": "message",
    "ChannelIdentity": {
      "ChannelId": "19:9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1@thread.tacv2",
      "TeamId": "002145f2-eaba-4962-997d-6d841a9f50af"
    },
    "ChatId": null,
    "EventDetail": null
  },
  {
    "Id": "1760954236688",
    "Body": {
      "ContentType": "html",
      "Content": "\u003CsystemEventMessage/\u003E"
    },
    "CreatedDateTime": "2025-10-20T09:57:16.688+00:00",
    "LastModifiedDateTime": "2025-10-20T09:57:16.688+00:00",
    "LastEditedDateTime": null,
    "DeletedDateTime": null,
    "Subject": null,
    "Summary": null,
    "Importance": "normal",
    "Locale": "en-us",
    "PolicyViolation": null,
    "ReplyToId": null,
    "WebUrl": "https://teams.microsoft.com/l/message/19%3A9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1%40thread.tacv2/1760954236688?groupId=002145f2-eaba-4962-997d-6d841a9f50af\u0026tenantId=af4acab6-6476-4c2f-bef2-ff6479dd3940\u0026createdTime=1760954236688\u0026parentMessageId=1760954236688",
    "From": null,
    "Attachments": [],
    "Mentions": [],
    "Reactions": [],
    "MessageHistory": null,
    "MessageType": "unknownFutureValue",
    "ChannelIdentity": {
      "ChannelId": "19:9OOyLpkB8mEaoB17Z5CJx-RDBuMCZ5IZfuZVTCV97Bg1@thread.tacv2",
      "TeamId": "002145f2-eaba-4962-997d-6d841a9f50af"
    },
    "ChatId": null,
    "EventDetail": {
      "EventType": null,
      "Initiator": {
        "Application": null,
        "Device": null,
        "User": {
          "DisplayName": null,
          "Id": "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
          "TenantId": "af4acab6-6476-4c2f-bef2-ff6479dd3940",
          "Thumbnails": null
        },
        "Conversation": null,
        "ConversationIdentityType": null,
        "Encrypted": null,
        "OnPremises": null,
        "Guest": null,
        "Phone": null
      },
      "CallEnded": null,
      "CallRecording": null,
      "CallStarted": null,
      "CallTranscript": null,
      "ChannelAdded": null,
      "ChannelDeleted": null,
      "ChannelDescriptionUpdated": null,
      "ChannelRenamed": null,
      "ChannelSetAsFavoriteByDefault": null,
      "ChannelUnsetAsFavoriteByDefault": null,
      "ChatRenamed": null,
      "ConversationMemberRoleUpdated": null,
      "MeetingPolicyUpdated": null,
      "MembersAdded": null,
      "MembersDeleted": null,
      "MembersJoined": null,
      "MembersLeft": null,
      "MessagePinned": null,
      "MessageUnpinned": null,
      "TabUpdated": null,
      "TeamArchived": null,
      "TeamCreated": null,
      "TeamDescriptionUpdated": null,
      "TeamJoiningDisabled": null,
      "TeamJoiningEnabled": null,
      "TeamRenamed": null,
      "TeamsAppInstalled": null,
      "TeamsAppRemoved": null,
      "TeamsAppUpgraded": null,
      "TeamUnarchived": null
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: retainedMessages_002145f2-eaba-4962-997d-6d841a9f50af.json]---
Location: zulip-main/zerver/tests/fixtures/microsoft_teams_fixtures/TeamsData_ZulipChat/teams/002145f2-eaba-4962-997d-6d841a9f50af/retainedMessages_002145f2-eaba-4962-997d-6d841a9f50af.json

```json
[]
```

--------------------------------------------------------------------------------

````
