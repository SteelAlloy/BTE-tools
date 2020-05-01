#Include %A_LineFile%\..\JSON.ahk

FileSelectFile, file, , , Select file to convert, JSON (temp.json)
if ErrorLevel {
  ExitApp
  Return
}
InputBox, delay, Delay between entries, Please enter a delay., , , , , , , , 50
if ErrorLevel {
  ExitApp
  Return
}

FileRead jsonString, %file%
Data := JSON.Load(jsonString)

stringified := JSON.Dump(Data,, 4)
stringified := StrReplace(stringified, "`n", "`r`n") ; for display purposes only

MsgBox, Conversion will start in 2 sec. Focus on the Minecraft windows.
Sleep, 2000

Enter(string, delay) {
  SendRaw t
  Sleep, %delay%
  SendInput % string
  Sleep, %delay%
  Send {Enter}
  Sleep, %delay%
}

Enter("Start BTE-tools", delay)

for i, path in Data {
  for j, coord in Data[i] {
    x := coord[2]
    y := coord[1]
    Enter("/terra convert " . x . " " . y, delay)
  }
  Enter("-------", delay)
}

Enter("End BTE-tools", delay)
