---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1128
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1128 of 1290)

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

---[FILE: push_multiple_committers.json]---
Location: zulip-main/zerver/webhooks/bitbucket2/fixtures/push_multiple_committers.json

```json
{
   "actor":{
      "links":{
         "self":{
            "href":"https://api.bitbucket.org/2.0/users/kolaszek"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/"
         },
         "avatar":{
            "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
         }
      },
      "type":"user",
      "nickname":"Tomasz Kolaszek",
      "display_name":"Tomasz",
      "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
   },
   "repository":{
      "scm":"git",
      "is_private":true,
      "type":"repository",
      "website":"",
      "name":"Repository name",
      "owner":{
         "links":{
            "self":{
               "href":"https://api.bitbucket.org/2.0/users/kolaszek"
            },
            "html":{
               "href":"https://bitbucket.org/kolaszek/"
            },
            "avatar":{
               "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
            }
         },
         "type":"user",
         "nickname":"Tomasz Kolaszek",
         "display_name":"Tomasz",
         "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
      },
      "links":{
         "self":{
            "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/repository-name"
         },
         "avatar":{
            "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
         }
      },
      "full_name":"kolaszek/repository-name",
      "uuid":"{59005838-3978-410b-84fd-8b4ce1b41089}"
   },
   "push":{
      "changes":[
         {
            "truncated":false,
            "closed":false,
            "new":{
               "links":{
                  "self":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/refs/branches/master"
                  },
                  "html":{
                     "href":"https://bitbucket.org/kolaszek/repository-name/branch/master"
                  },
                  "commits":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits/master"
                  }
               },
               "type":"branch",
               "repository":{
                  "uuid":"{59005838-3978-410b-84fd-8b4ce1b41089}",
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name"
                     },
                     "avatar":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
                     }
                  },
                  "type":"repository",
                  "full_name":"kolaszek/repository-name",
                  "name":"Repository name"
               },
               "name":"master",
               "target":{
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Tomasz Kolaszek",
                        "display_name":"Tomasz",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               }
            },
            "old":null,
            "created":true,
            "links":{
               "html":{
                  "href":"https://bitbucket.org/kolaszek/repository-name/branch/master"
               },
               "commits":{
                  "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits?include=84b96adc644a30fd6465b3d196369d880762afed"
               }
            },
            "commits":[
               {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Tomasz Kolaszek",
                        "display_name":"Tomasz",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },

                               {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Zev Benjamin",
                        "display_name":"Ben",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Benjamin Simon <ben-simon@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Zev Benjamin",
                        "display_name":"Ben",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Benjamin Simon <ben-simon@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               }
            ],
            "forced":false
         }
      ]
   }
}
```

--------------------------------------------------------------------------------

---[FILE: push_multiple_committers_with_others.json]---
Location: zulip-main/zerver/webhooks/bitbucket2/fixtures/push_multiple_committers_with_others.json

```json
{
   "actor":{
      "links":{
         "self":{
            "href":"https://api.bitbucket.org/2.0/users/kolaszek"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/"
         },
         "avatar":{
            "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
         }
      },
      "type":"user",
      "nickname":"Tomasz Kolaszek",
      "display_name":"Tomasz",
      "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
   },
   "repository":{
      "scm":"git",
      "is_private":true,
      "type":"repository",
      "website":"",
      "name":"Repository name",
      "owner":{
         "links":{
            "self":{
               "href":"https://api.bitbucket.org/2.0/users/kolaszek"
            },
            "html":{
               "href":"https://bitbucket.org/kolaszek/"
            },
            "avatar":{
               "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
            }
         },
         "type":"user",
         "nickname":"Tomasz Kolaszek",
         "display_name":"Tomasz",
         "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
      },
      "links":{
         "self":{
            "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/repository-name"
         },
         "avatar":{
            "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
         }
      },
      "full_name":"kolaszek/repository-name",
      "uuid":"{59005838-3978-410b-84fd-8b4ce1b41089}"
   },
   "push":{
      "changes":[
         {
            "truncated":false,
            "closed":false,
            "new":{
               "links":{
                  "self":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/refs/branches/master"
                  },
                  "html":{
                     "href":"https://bitbucket.org/kolaszek/repository-name/branch/master"
                  },
                  "commits":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits/master"
                  }
               },
               "type":"branch",
               "repository":{
                  "uuid":"{59005838-3978-410b-84fd-8b4ce1b41089}",
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name"
                     },
                     "avatar":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
                     }
                  },
                  "type":"repository",
                  "full_name":"kolaszek/repository-name",
                  "name":"Repository name"
               },
               "name":"master",
               "target":{
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Tomasz Kolaszek",
                        "display_name":"Tomasz",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               }
            },
            "old":null,
            "created":true,
            "links":{
               "html":{
                  "href":"https://bitbucket.org/kolaszek/repository-name/branch/master"
               },
               "commits":{
                  "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits?include=84b96adc644a30fd6465b3d196369d880762afed"
               }
            },
            "commits":[
               {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Tomasz Kolaszek",
                        "display_name":"Tomasz",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Tomasz Kolaszek",
                        "display_name":"Tomasz",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Tomasz Kolaszek",
                        "display_name":"Tomasz",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Tomasz Kolaszek",
                        "display_name":"Tomasz",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Tomasz Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"James Franklin",
                        "display_name":"James",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"James Franklin <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                 {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"James Franklin",
                        "display_name":"James",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"James Franklin <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"James Kolek",
                        "display_name":"James",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"James Kolek <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Brendon Rogers",
                        "display_name":"Brendon",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Brendon Rogers <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },
                {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Brendon Rogers",
                        "display_name":"Brendon",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Brendon Rogers <tomasz-kolek@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               },

                               {
                  "type":"commit",
                  "hash":"84b96adc644a30fd6465b3d196369d880762afed",
                  "message":"first commit\n",
                  "author":{
                     "user":{
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/users/kolaszek"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/"
                           },
                           "avatar":{
                              "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
                           }
                        },
                        "type":"user",
                        "nickname":"Zev Benjamin",
                        "display_name":"Ben",
                        "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}"
                     },
                     "raw":"Benjamin Simon <ben-simon@o2.pl>"
                  },
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/84b96adc644a30fd6465b3d196369d880762afed"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/84b96adc644a30fd6465b3d196369d880762afed"
                     }
                  },
                  "date":"2016-06-30T15:32:24+00:00",
                  "parents":[

                  ]
               }
            ],
            "forced":false
         }
      ]
   }
}
```

--------------------------------------------------------------------------------

---[FILE: push_one_tag.json]---
Location: zulip-main/zerver/webhooks/bitbucket2/fixtures/push_one_tag.json

```json
{
   "actor":{
      "links":{
         "avatar":{
            "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/"
         },
         "self":{
            "href":"https://api.bitbucket.org/2.0/users/kolaszek"
         }
      },
      "website":null,
      "display_name":"Tomasz",
      "created_on":"2016-06-29T17:51:47.001868+00:00",
      "type":"user",
      "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}",
      "location":null,
      "nickname":"Tomasz Kolaszek"
   },
   "repository":{
      "links":{
         "avatar":{
            "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/repository-name"
         },
         "self":{
            "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
         }
      },
      "full_name":"kolaszek/repository-name",
      "uuid":"{59005838-3978-410b-84fd-8b4ce1b41089}",
      "owner":{
         "links":{
            "avatar":{
               "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
            },
            "html":{
               "href":"https://bitbucket.org/kolaszek/"
            },
            "self":{
               "href":"https://api.bitbucket.org/2.0/users/kolaszek"
            }
         },
         "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}",
         "display_name":"Tomasz",
         "type":"user",
         "nickname":"Tomasz Kolaszek"
      },
      "name":"Repository name",
      "is_private":false,
      "type":"repository",
      "website":"",
      "scm":"git"
   },
   "push":{
      "changes":[
         {
            "links":{
               "commits":{
                  "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits?include=c47631f097fd69c294486b5f9b99deb4a05cb285"
               }
            },
            "forced":false,
            "created":true,
            "closed":false,
            "truncated":false,
            "new":{
               "links":{
                  "commits":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits/a"
                  },
                  "self":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/refs/tags/a"
                  },
                  "html":{
                     "href":"https://bitbucket.org/kolaszek/repository-name/commits/tag/a"
                  }
               },
               "target":{
                  "links":{
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/450118afff93569d1ce362174e9f1a7f104f9166"
                     },
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/450118afff93569d1ce362174e9f1a7f104f9166"
                     }
                  },
                  "parents":[
                     {
                        "links":{
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/repository-name/commits/c47631f097fd69c294486b5f9b99deb4a05cb285"
                           },
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/c47631f097fd69c294486b5f9b99deb4a05cb285"
                           }
                        },
                        "hash":"c47631f097fd69c294486b5f9b99deb4a05cb285",
                        "type":"commit"
                     }
                  ],
                  "message":"abc\n",
                  "hash":"450118afff93569d1ce362174e9f1a7f104f9166",
                  "author":{
                     "raw":"Tomasz Kolek <tomasz-kolek@go2.pl>"
                  },
                  "date":"2016-11-09T12:52:38+00:00",
                  "type":"commit"
               },
               "type":"tag",
               "name":"a"
            },
            "old":null
         }
      ]
   }
}
```

--------------------------------------------------------------------------------

---[FILE: push_remove_tag.json]---
Location: zulip-main/zerver/webhooks/bitbucket2/fixtures/push_remove_tag.json

```json
{
   "repository":{
      "type":"repository",
      "scm":"git",
      "full_name":"kolaszek/repository-name",
      "name":"Repository name",
      "uuid":"{59005838-3978-410b-84fd-8b4ce1b41089}",
      "is_private":false,
      "links":{
         "self":{
            "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name"
         },
         "avatar":{
            "href":"https://bitbucket.org/kolaszek/repository-name/avatar/32/"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/repository-name"
         }
      },
      "owner":{
         "display_name":"Tomasz",
         "type":"user",
         "links":{
            "self":{
               "href":"https://api.bitbucket.org/2.0/users/kolaszek"
            },
            "avatar":{
               "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
            },
            "html":{
               "href":"https://bitbucket.org/kolaszek/"
            }
         },
         "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}",
         "nickname":"Tomasz Kolaszek"
      },
      "website":""
   },
   "push":{
      "changes":[
         {
            "closed":true,
            "old":{
               "target":{
                  "message":"abc\n",
                  "author":{
                     "raw":"Tomasz Kolek <tomasz-kolek@go2.pl>"
                  },
                  "type":"commit",
                  "parents":[
                     {
                        "type":"commit",
                        "links":{
                           "self":{
                              "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/c47631f097fd69c294486b5f9b99deb4a05cb285"
                           },
                           "html":{
                              "href":"https://bitbucket.org/kolaszek/repository-name/commits/c47631f097fd69c294486b5f9b99deb4a05cb285"
                           }
                        },
                        "hash":"c47631f097fd69c294486b5f9b99deb4a05cb285"
                     }
                  ],
                  "date":"2016-11-09T12:52:38+00:00",
                  "hash":"450118afff93569d1ce362174e9f1a7f104f9166",
                  "links":{
                     "self":{
                        "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commit/450118afff93569d1ce362174e9f1a7f104f9166"
                     },
                     "html":{
                        "href":"https://bitbucket.org/kolaszek/repository-name/commits/450118afff93569d1ce362174e9f1a7f104f9166"
                     }
                  }
               },
               "type":"tag",
               "links":{
                  "commits":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/commits/a"
                  },
                  "self":{
                     "href":"https://api.bitbucket.org/2.0/repositories/kolaszek/repository-name/refs/tags/a"
                  },
                  "html":{
                     "href":"https://bitbucket.org/kolaszek/repository-name/commits/tag/a"
                  }
               },
               "name":"a"
            },
            "created":false,
            "forced":false,
            "new":null,
            "truncated":false
         }
      ]
   },
   "actor":{
      "type":"user",
      "uuid":"{678ab31f-9f88-4d7a-b343-1bdf9f024917}",
      "location":null,
      "created_on":"2016-06-29T17:51:47.001868+00:00",
      "display_name":"Tomasz",
      "links":{
         "self":{
            "href":"https://api.bitbucket.org/2.0/users/kolaszek"
         },
         "avatar":{
            "href":"https://bitbucket.org/account/kolaszek/avatar/32/"
         },
         "html":{
            "href":"https://bitbucket.org/kolaszek/"
         }
      },
      "website":null,
      "nickname":"Tomasz Kolaszek"
   }
}
```

--------------------------------------------------------------------------------

````
