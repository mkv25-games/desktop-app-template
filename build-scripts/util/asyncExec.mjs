import childProcess from 'child_process'
const execSync = childProcess.exec

function exec (command, options) {
  return new Promise(function (resolve, reject) {
    execSync(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          stdout: (stdout || '').trim(),
          stderr: (stderr || '').trim()
        })
      }
    })
  })
}

export default exec
