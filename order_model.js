const mongoose = require("mongoose"); // Add mongoose library.

//Tietomalli: Machining parameter set
//string: Tool name (e.g. Jyrsin 10mm)
//string: Material (e.g. S355)
//number: Cutting speed (e.g. 100 m/min)
//number: Feed rate (e.g. 0.25 mm/teeth)

const schema = new mongoose.Schema( // Create a new mongoose scheme and define it's model.
    {
        tool_name:{
            type: String,
            required: true
        },
        material:{
            type: String,
            required: true
        },
        cutting_speed_m_min:{
            type: Number,
            required: true
        },
        feed_rate_mm_teeth:{
            type: Number,
            required: true
        }
    }
);

module.exports = mongoose.model("order", schema); // Export defined model with schema.