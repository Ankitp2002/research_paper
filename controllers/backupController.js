const Backup = require("../models/backupModel");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

// Get all backups
exports.getAllBackups = async (req, res) => {
  try {
    const backups = await Backup.findAll();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving backups", error });
  }
};

// Get a backup by ID
exports.getBackupById = async (req, res) => {
  try {
    const backup = await Backup.findByPk(req.params.id);
    if (!backup) return res.status(404).json({ message: "Backup not found" });
    res.json(backup);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving backup", error });
  }
};

// Create a new backup
exports.createBackup = async (req, res) => {
  const { backup_name } = req.body;
  try {
    // Check if a backup with the same name already exists
    const existingBackup = await Backup.findOne({
      where: { backup_name: backup_name },
    });
    if (existingBackup) {
      return res
        .status(400)
        .json({ message: "Backup with this name already exists" });
    }

    // Define backup file path
    const backupFilePath = path.join(
      "E:\\freelancing\\sql_backup",
      `${backup_name}.sql`
    );

    // Ensure the directory exists
    if (!fs.existsSync("E:\\freelancing\\sql_backup")) {
      fs.mkdirSync("E:\\freelancing\\sql_backup", { recursive: true });
    }

    // Log the mysqldump command for debugging
    const command = `mysqldump -u ${process.env.DB_USER} -p"${process.env.DB_PASSWORD}" ${process.env.DB_NAME} > ${backupFilePath}`;
    console.log("Executing command:", command);

    // Execute mysqldump command to create the backup
    const { stdout, stderr } = await execPromise(command);

    if (
      stderr &&
      !stderr.includes(
        "mysqldump: [Warning] Using a password on the command line interface can be insecure"
      )
    ) {
      console.error("stderr:", stderr);
      return res
        .status(500)
        .json({ message: "Error during mysqldump execution", error: stderr });
    }

    // Store backup file path in the database
    const backup = await Backup.create({
      backup_name: backup_name,
      backup_file_path: backupFilePath,
    });

    return res.status(201).json(backup);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error creating backup", error });
  }
};
