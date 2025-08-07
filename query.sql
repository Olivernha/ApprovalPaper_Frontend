db.departments.updateOne(
  { name: "BD" },
  { $set: { priority: 20 } }
);

db.departments.updateOne(
  { name: "IT" },
  { $set: { priority: 14 } }
);

db.departments.updateOne(
  { name: "Retail" },
  { $set: { full_name: "Tuas Power Supply Pte Ltd", priority: 4 } }
);

db.departments.updateOne(
  { name: "Tembusu" },
  { $set: { priority: 18 } }
);

db.departments.updateOne(
  { name: "Tembusu(Remove)" },
  { $set: { priority: 21 } }
);

db.departments.updateOne(
  { name: "Tembusu(Removed)" },
  { $set: { priority: 22 } }
);

db.departments.updateOne(
  { name: "TPG" },
  { $set: { full_name: "Tuas Power Generation Pte Ltd", priority: 2 } }
);

db.departments.updateOne(
  { name: "TPL" },
  { $set: { full_name: "Tuas Power Ltd", priority: 1 } }
);

db.departments.updateOne(
  { name: "TPU" },
  { $set: { full_name: "TP Utilities Pte Ltd", priority: 3 } }
);

db.departments.updateOne(
  { name: "Security" },
  { $set: { priority: 15 } }
);

db.departments.updateOne(
  { name: "OL" },
  { $set: { priority: 16 } }
);

db.departments.updateOne(
  { name: "TPGOL" },
  { $set: { priority: 17 } }
);

db.departments.updateOne(
  { name: "TPSTM" },
  { $set: { full_name: "TP-STM Water Resources Pte Ltd", priority: 7 } }
);

db.departments.updateOne(
  { name: "EPC" },
  { $set: { full_name: "EPC JV", priority: 9 } }
);

db.departments.updateOne(
  { name: "TPSTMWS" },
  { $set: { full_name: "TP-STM Water Services Pte Ltd", priority: 8 } }
);

db.departments.updateOne(
  { name: "TPSTMWR" },
  { $set: { priority: 19 } }
);

db.departments.updateOne(
  { name: "SP" },
  { $set: { full_name: "Sinosing Power Pte Ltd", priority: 10 } }
);

db.departments.updateOne(
  { name: "SSS" },
  { $set: { full_name: "Sinosing Services Pte Ltd", priority: 11 } }
);

db.departments.updateOne(
  { name: "SSD" },
  { $set: { full_name: "Sinosing Development Pte Ltd", priority: 13 } }
);

db.departments.updateOne(
  { name: "SGI" },
  { $set: { full_name: "Sinosing Green Investment Pte Ltd", priority: 12 } }
);

db.departments.updateOne(
  { name: "TPGS" },
  { $set: { full_name: "TPGS Green Energy Pte Ltd", priority: 6 } }
);

db.departments.updateOne(
  { name: "TPAM" },
  { $set: { full_name: "TP Asset Management Pte Ltd", priority: 5 } }
);

                        