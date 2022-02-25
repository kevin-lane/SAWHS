$connectToSite = "https://kevinssharepoint.sharepoint.com/"
$siteCollectionName = "Staff And Workplace Health Safety(SAWHS)"
$siteAlias = "SAWHS"
Connect-PnPOnline -Url $connectToSite -UseWebLogin

New-PnPSite -Type TeamSite -Title $siteCollectionName -Alias $siteAlias

$siteCollectionUrl = $connectToSite + 'sites/' + $siteAlias

Connect-PnPOnline -Url $siteCollectionUrl -UseWebLogin

#Employee List
New-PnPList -Title "Employee" -Url "employee" -Template GenericList

$employeeList = Get-PnPList -Identity "Employee"

Add-PnPField -List $employeeList  -DisplayName "Vaccinated" -InternalName "Vaccinated" -Type Choice -Choices "Yes", "No" -AddToDefaultView
Add-PnPField -List $employeeList  -DisplayName "Number Of Doses" -InternalName "Number_Of_Doses" -Type Choice -Choices "1", "2", "3", "4" -AddToDefaultView

$authorField = Get-PnPField -List $employeeList -Identity "Author"
$vaccinatedField = Get-PnPField -List $employeeList -Identity "Vaccinated"
$numberOfDosesField = Get-PnPField -List $employeeList -Identity "Number Of Doses"
$titleField = Get-PnPField -List $employeeList -Identity "Title" -


Add-PnPView -Title "Employee View" -Fields "Author", "Vaccinated", "Number Of Doses" -List $employeeList -SetAsDefault

$parentCT = Get-PnPContentType |?{$_.Name -eq "Item"}

$employeeCT = Add-PnPContentType -Name "Employee Content Type" -Description "Content Type for Employee List" -Group "custom" -ParentContentType $parentCT

Add-PnPFieldToContentType -Field $authorField -ContentType $employeeCT
Add-PnPFieldToContentType -Field $vaccinatedField -ContentType $employeeCT
Add-PnPFieldToContentType -Field $numberOfDosesField -ContentType $employeeCT

Add-PnPContentTypeToList -ContentType $employeeCT -List $employeeList -DefaultContentType

$parentCT.Hidden = $true
$titleField.Hidden = $true


#Daily Health Declaration List
New-PnPList -Title "Health Declarations" -Url "healtdeclarations" -Template GenericList -OnQuickLaunch
$healthDeclarationList = Get-PnPList -Identity "Health Declarations"

Add-PnPField -List $healthDeclarationList -DisplayName "Symptoms" -InternalName "Symptoms" -Type Choice -Choices "YES", "NO" -AddToDefaultView
Add-PnPField -List $healthDeclarationList -DisplayName "Travel" -InternalName "Travel" -Type Choice -Choices "YES", "NO" -AddToDefaultView
Add-PnPField -List $healthDeclarationList -DisplayName "Presence at Office" -InternalName "Presence" -Type Choice -Choices "YES", "NO" -AddToDefaultView
Add-PnPField -List $healthDeclarationList -DisplayName "Reason to be at Office" -InternalName "Reason" -Type Choice -Choices "Signing Documents", "Problems at home", "No" -AddToDefaultView

$symptomsField = Get-PnPField -List $healthDeclarationList -Identity "Symptoms"
$travelField = Get-PnPField -List $healthDeclarationList -Identity "Travel"
$presenceField = Get-PnPField -List $healthDeclarationList -Identity "Presence"
$reasonField = Get-PnPField -List $healthDeclarationList -Identity "Reason"
$employeeField = Get-PnPField -List $healthDeclarationList -Identity "Author"

Add-PnPView -Title "Health Declaration View" -Fields "Author", "Symptoms", "Travel", "Presence at Office", "Reason to be at Office" -List $healthDeclarationList -SetAsDefault

$healthDeclarationCT = Add-PnPContentType -Name "Health Declaration Content Type" -Description "Content Type for Health Declaration List" -Group "custom" -ParentContentType $parentCT

Add-PnPFieldToContentType -Field $symptomsField -ContentType $healthDeclarationCT
Add-PnPFieldToContentType -Field $travelField -ContentType $healthDeclarationCT
Add-PnPFieldToContentType -Field $presenceField -ContentType $healthDeclarationCT
Add-PnPFieldToContentType -Field $reasonField -ContentType $healthDeclarationCT
Add-PnPFieldToContentType -Field $employeeField -ContentType $healthDeclarationCT

Add-PnPContentTypeToList -ContentType $healthDeclarationCT -List $healthDeclarationList -DefaultContentType