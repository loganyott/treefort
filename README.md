# api-fort
The backend api for web-fort and app-fort

# Early Stage Data

```
{
  event: {
    // client code will need to generate unique codes, consider <tf-year>-<md5(Name)> or 
    "Code" : "2017-69420",
    "Name" : "Really Awesome Show!",
    "Description" : "This show will be insane! Be there or be <h1>SQUARE</h1>",
    "StartTime" : "ISO Timestamp",
    "EndTime" : "ISO Timestamp",

    // Array of forts that this event is part of, some events span fort boundaries!
    "Forts" : ["Music", "YogaFort", "PerformanceArt"],

    // Array of "tracks" which is basically a grouping of events or a tag
    "Tracks" : ["Gender Shows", "Some Other Cool Group!"],

    // Array of performer codes that will perform at this event, sometimes more than one performer
    // performs ... Yogafort, for example,
    "Performers" : ["2017-42069", "2017-424242", "2017-696969"],

    // Venue code that this event will take place at
    "Venue" : "2017-TheNeurolux",
  },
  performer: {
    // client code will need to generate unique codes, consider <tf-year>-<md5(Name)> or 
    // something along those lines on CREATE so we can rename Performer items
    "Code" : "2017-42069",

    // These fields are all trivial, some will allow Html and most will not
    "Name" : "They Might Be Giants",
    "Bio" : "We are <h1>awesome</h1>",
    "SocialUrl" : "http://only.one.link",
    "HomeTown" : "Lincoln, Massachusetts",

    // Custom #ApiFort app will need to upload and setup proper URLs for performers
    "ImageUrl" : "https://s3.cdn.endpoint-for-imgs",
    "SongUrl" : "https://s3.cdn.endpoint-for-mp3s",

    // Array of forts that this performer might perform at, this will really only be used by #WebFort
    // to show performer announcement information
    "Forts" : ["Music", "YogaFort", "PerformanceArt"],

    // The performer wave that this performer is associated to
    "Wave" : "ISO Timestamp"
  },
  venue: {
    // client code will need to generate these unique codes again so we can rename
    // consider <tf-year>-<removespaces(Name)> or something similar on CREATE
    "Code" : "2017-TheNeurolux",
  
    // Trivial information fields that will be setup by us
    "Name" : "The Neurolux",
    "Description" : "The Neurolux will be <h2>fun</h2>",
    "SocialUrl" : "http://neurolux.com",
    "ImageUrl" : "https://s3.cdn.endpoint-for-imgs",
    "Address" : "11 N 11th St, Boise, ID 83702",
  
    // additional field for sub-venues like campfire stage
    "AdditionalDirections" : ""  
  } 
}
```
