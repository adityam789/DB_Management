const guestSchema = {
    'First Name': {
        prop: 'FirstName',
        type: String,
        required: true,
    },
    'Last Name': {
        prop: 'LastName',
        type: String,
        required: true,        
    },
    'Email': {
        prop: 'Email',
        type: String, 
        required: true,
    },
    'About': {
        prop: 'About',
        type: String, 
        required: true,        
    },
    'Role': {
        prop: 'Role',
        type: String, 
        required: true,        
    },
    'Organization': {
        prop: 'Organization',
        type: String, 
        required: true,        
    },
    'Time Zone': {
        prop: 'TimeZone',
        type: String, 
        required: true,        
    }
}

const stageSchema = {
    'Name': {
        prop: 'Name',
        type: String,
        required: true,
    },
    'Date': {
        prop: 'Date',
        type: Date,
        required: true,
    },
    'Time': {
        prop: 'Time',
        type: Time,
        required: true,
    },
    'Duration Hours': {
        prop: 'DurationHours',
        type: Number,
        required: true,
    },
    'Duration Minutes': {
        prop: 'DurationMinutes',
        type: Number,
        required: true,        
    },
    'Description': {
        prop: 'Description',
        type: String, 
        required: true,        
    }
}

const scheduleScheme = {
    'Stage': {
        prop: 'Stage',
        type: String, 
        required: true,
    },
    'Name': {
        prop: 'Name',
        type: String, 
        required: true,
    },
    'Description': {
        prop: 'Description',
        type: String, 
        required: true,
    },
    'Start Time': {
        prop: 'StartTime',
        type: Time, 
        required: true,
    },
    'End Time': {
        prop: 'EndTime',
        type: Time, 
        required: true,
    },
    'Reporting Time': {
        prop: 'ReportingTime',
        type: Time, 
        required: true,
    },
    'Artist1': {
        prop: 'a1',
        type: String, 
        required: true,
    },
    'Artist2': {
        prop: 'a2',
        type: String, 
    },
    'Artist3': {
        prop: 'a3',
        type: String, 
    },
    'Artist4': {
        prop: 'a4',
        type: String, 
    },
    'Artist5': {
        prop: 'a5',
        type: String, 
    },
    'Artist6': {
        prop: 'a6',
        type: String, 
    },
    'Artist7': {
        prop: 'a7',
        type: String, 
    },
    'Artist8': {
        prop: 'a8',
        type: String, 
    },
    'Artist9': {
        prop: 'a9',
        type: String, 
    },
    'Artist10': {
        prop: 'a10',
        type: String, 
    },
    'Artist11': {
        prop: 'a11',
        type: String, 
    },
    'Artist12': {
        prop: 'a12',
        type: String, 
    },
}

// Not using ATM
function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
      return true;
    } else {  
      alert("Invalid email address!");
      return false;
    } 
}

module.exports = {Guests: guestSchema, Stages: stageSchema, Schedule: scheduleScheme};