use admin

db.createUser(
  {
    "user": "smart_shelf",
    "pwd": "testPWD",
    "roles": [
      "userAdminAnyDatabase",
      "dbAdminAnyDatabase",
      "readWriteAnyDatabase"
    ]
  }
)

exit