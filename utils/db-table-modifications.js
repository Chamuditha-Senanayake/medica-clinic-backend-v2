/*

---- 'BillDataSet' table ----

Add 'new' columns ----
currently on 
clinic
bangla
...

ALTER TABLE [MedicaClinic].[dbo].[BillDataSet]
ADD HospitalFee float DEFAULT 0.0;    

ALTER TABLE [MedicaClinic].[dbo].[BillDataSet]
ADD DoctorFee float DEFAULT 0.0;    

ALTER TABLE [MedicaClinic].[dbo].[BillDataSet]
ADD TotalFee float DEFAULT 0.0;    

ALTER TABLE [MedicaClinic].[dbo].[BillDataSet]
ADD RefundedHospitalFee float DEFAULT 0.0;    

ALTER TABLE [MedicaClinic].[dbo].[BillDataSet]
ADD RefundedDoctorFee float DEFAULT 0.0;    

ALTER TABLE [MedicaClinic].[dbo].[BillDataSet]
ADD RefundedTotalFee float DEFAULT 0.0;    


ALTER TABLE [MedicaClinic].[dbo].[Bill] ***
ADD PaymentStatus NVARCHAR(50) DEFAULT 'Unpaid';

***[Didn't set the default values]  


--------
[UserModified]        INT            NULL,
    [DateModified]        DATETIME       NULL, add
mewath add krnnone 
--------

Set default to values 'new' columns ----
currently on 
clinic
bangla
...

UPDATE [MedicaClinic].[dbo].[BillDataSet]
SET [HospitalFee] = 0.0;

UPDATE [MedicaClinic].[dbo].[BillDataSet]
SET [DoctorFee] = 0.0;

UPDATE [MedicaClinic].[dbo].[BillDataSet]
SET [TotalFee] = 0.0;

UPDATE [MedicaClinic].[dbo].[BillDataSet]
SET [RefundedHospitalFee] = 0.0;

UPDATE [MedicaClinic].[dbo].[BillDataSet]
SET [RefundedDoctorFee] = 0.0;

UPDATE [MedicaClinic].[dbo].[BillDataSet]
SET [RefundedTotalFee] = 0.0;

*/

/*
 * Fri 8th Dec 2023 by Lasith Eranda

currently on 
clinic
bangla
...
synced changes to AppointmentGet SP in medica bangla 
issue: no patient details were loading the clinic sp is changed but changes not synced with medica bangla
updated query
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[AppointmentGet]
	@UserId INT,
	@Id INT = NULL,
	@Number INT = NULL,
	@SessionId INT  = NULL,
	@PatientId INT = NULL,
	@PatientMobile NVARCHAR(15) = NULL
AS
BEGIN
	BEGIN TRY
		DECLARE @UserTypeId INT = 0
		DECLARE @AllowedSessions TABLE(Id INT)

		SELECT	@UserTypeId = UT.Id
		FROM	Users U
					INNER JOIN UserGroups UG ON U.UserGroupId = UG.Id
					INNER JOIN UserTypes UT ON UG.UserTypeId = UT.Id
		WHERE	U.Id = @UserId

		IF @UserTypeId NOT IN (1, 2, 3, 4,5)
			RAISERROR('2304 - You are not allowed to perform this operation.', 16, 1)

		IF @UserTypeId = 2
		BEGIN
			INSERT 
			INTO	@AllowedSessions (Id)
			SELECT	DISTINCT S.Id
			FROM	Sessions S
						INNER JOIN InstituteBranches IB ON S.InstituteBranchId = IB.Id
						INNER JOIN InstituteBranchEmployees IBE ON IB.Id = IBE.InstituteBranchId
						INNER JOIN UserEmployees UE ON IBE.EmployeeId = UE.EmployeeId
						INNER JOIN Users U ON UE.UserId = U.Id
			WHERE	U.Id = @UserId
		END
		ELSE IF @UserTypeId = 3
		BEGIN
			INSERT 
			INTO	@AllowedSessions (Id)
			SELECT	DISTINCT S.Id
			FROM	Sessions S
						INNER JOIN UserDoctors UD ON S.DoctorId = UD.DoctorId
						INNER JOIN Users U ON UD.UserId = U.Id
			WHERE	U.Id = @UserId

			
		END
		ELSE IF @UserTypeId = 4
		BEGIN
			INSERT 
			INTO	@AllowedSessions (Id)
			SELECT	DISTINCT S.Id
			FROM	Sessions S
						INNER JOIN DoctorNurses DN ON S.DoctorId = DN.DoctorId
						INNER JOIN UserNurses UN ON DN.NurseId = UN.NurseId
						INNER JOIN Users U ON UN.UserId = U.Id
			WHERE	U.Id = @UserId
		END


		IF COALESCE(@Id, 0) > 0
		BEGIN
			IF @UserTypeId = 1
				SELECT	Id, Number, PatientId, SessionId, Status, Description
				FROM	Appointments 
				WHERE	Id = @Id AND IsDeleted = 0
			ELSE
			BEGIN
				SELECT	(D.Title+'  '+D.FirstName+'  '+D.LastName) DoctorName,SE.DoctorId,
						SE.TimeStart, SE.TimeEnd,
				        Utils.dbo.GetHashedId(P.Id) PatientId, P.Title, P.FirstName, P.LastName,
				        P.NIC,P.Gender,P.Email,P.Mobile,P.DateOfBirth
						,A.Id, A.Number, A.PatientId, A.SessionId, A.Status, A.Description, DCS.ChannelingStatus,DCS.DoctorStatus,A.Type
				FROM	Appointments A
							INNER JOIN @AllowedSessions AlS ON A.SessionId = AlS.Id
							INNER JOIN Patients P ON A.PatientId  = P.Id
							LEFT JOIN  DoctorChannelingStatuses DCS ON A.Id = DCS.AppointmentId
							LEFT JOIN  Sessions SE ON SE.Id = A.SessionId
							LEFT JOIN  Doctors D ON D.Id = SE.DoctorId
							--INNER JOIN @AllowedSessions AlS ON A.SessionId = AlS.Id
				WHERE	A.Id = @Id AND A.IsDeleted = 0

			END
		END
		ELSE IF @Number IS NOT NULL AND COALESCE(@Number, 0) = '999999'
		BEGIN
			IF @UserTypeId = 1
				SELECT	Id, Number, PatientId, SessionId, Status, Description
				FROM	Appointments 
				WHERE	Number = @Number AND SessionId = @SessionId AND IsDeleted = 0
			ELSE
				SELECT	(D.Title+'  '+D.FirstName+'  '+D.LastName) DoctorName,SE.DoctorId,
						SE.TimeStart, SE.TimeEnd,
				        Utils.dbo.GetHashedId(P.Id) PatientId, P.Title, P.FirstName, P.LastName,
				        P.NIC,P.Gender,P.Email,P.Mobile,P.DateOfBirth
						,A.Id, A.Number, A.PatientId, A.SessionId, A.Status, A.Description, DCS.ChannelingStatus,DCS.DoctorStatus,A.Type
				FROM	Appointments A
							INNER JOIN @AllowedSessions AlS ON A.SessionId = AlS.Id
							INNER JOIN Patients P ON A.PatientId  = P.Id
							LEFT JOIN  DoctorChannelingStatuses DCS ON A.Id = DCS.AppointmentId
							LEFT JOIN  Sessions SE ON SE.Id = A.SessionId
							LEFT JOIN  Doctors D ON D.Id = SE.DoctorId
				WHERE	D.Id = @PatientId AND FORMAT(SE.TimeStart, 'yyyy-MM-dd') = @PatientMobile AND A.IsDeleted = 0

		END
		ELSE IF @Number IS NOT NULL AND COALESCE(@SessionId, 0) > 0
		BEGIN
			IF @UserTypeId = 1
				SELECT	Id, Number, PatientId, SessionId, Status, Description
				FROM	Appointments 
				WHERE	Number = @Number AND SessionId = @SessionId AND IsDeleted = 0
			ELSE
				SELECT	Utils.dbo.GetHashedId(P.Id) PatientId, P.Title, P.FirstName, 
				 P.LastName,P.NIC,P.Gender,P.Email,P.Mobile,P.DateOfBirth,A.Id, A.Number,
				 A.PatientId, A.SessionId, A.Status, A.Description,DCS.ChannelingStatus,DCS.DoctorStatus,A.Type
				FROM	Appointments A
							INNER JOIN @AllowedSessions AlS ON A.SessionId = AlS.Id
							INNER JOIN Patients P ON A.PatientId  = P.Id
							LEFT JOIN  DoctorChannelingStatuses DCS ON A.Id = DCS.AppointmentId
				WHERE	A.Number = @Number AND A.SessionId = @SessionId AND A.IsDeleted = 0

		END
		ELSE IF COALESCE(@SessionId, 0) > 0
		BEGIN
			IF @UserTypeId = 1
				SELECT	Id, Number, PatientId, SessionId, Status,  Description
				FROM	Appointments 
				WHERE	SessionId = @SessionId AND IsDeleted = 0
			ELSE
				SELECT	(D.Title+'  '+D.FirstName+'  '+D.LastName) DoctorName,SE.DoctorId,
						SE.TimeStart, SE.TimeEnd, SE.Category AS Description,
				        Utils.dbo.GetHashedId(P.Id) PatientId, P.Title, P.FirstName, P.LastName,
				        P.NIC,P.Gender,P.Email,P.Mobile,P.DateOfBirth
						,A.Id, A.Number, A.PatientId, A.SessionId, A.Status, DCS.ChannelingStatus,DCS.DoctorStatus,A.Type
				FROM	Appointments A
							INNER JOIN @AllowedSessions AlS ON A.SessionId = AlS.Id
							INNER JOIN Patients P ON A.PatientId  = P.Id
							LEFT JOIN  DoctorChannelingStatuses DCS ON A.Id = DCS.AppointmentId
							LEFT JOIN  Sessions SE ON SE.Id = A.SessionId
							LEFT JOIN  Doctors D ON D.Id = SE.DoctorId
				WHERE	A.SessionId = @SessionId AND A.IsDeleted = 0
				ORDER BY A.Number ASC
		END

		ELSE IF COALESCE(@PatientId, 0) > 0
		BEGIN
			IF @UserTypeId = 1
				SELECT	Id, Number, PatientId, SessionId, Status,  Description
				FROM	Appointments 
				WHERE	PatientId = @PatientId AND IsDeleted = 0
			ELSE
				SELECT	A.Id, A.Number, A.PatientId, A.SessionId, A.Status, A.Description, S.TimeStart,S.TimeEnd,A.Type
				FROM	Appointments A
							INNER JOIN Sessions S ON A.SessionId = S.Id
				WHERE	A.PatientId = @PatientId AND CONVERT(DATE, S.TimeStart) = CONVERT(DATE, GETDATE());
				
		END

		ELSE IF COALESCE(@PatientMobile, '') != ''
		BEGIN
			
				SELECT	A.Id, A.Number, A.PatientId, A.SessionId, S.Status, A.Description, 
				S.TimeStart,S.TimeEnd, (D.Title+'  '+D.FirstName+'  '+D.LastName) DoctorName,
				DCS.ChannelingStatus,A.Type
				FROM	Appointments A
							INNER JOIN Sessions S ON A.SessionId = S.Id
							INNER JOIN Doctors D ON D.Id = S.DoctorId
							INNER JOIN Patients P ON P.Id = A.PatientId
							left outer join DoctorChannelingStatuses DCS on DCS.AppointmentId = A.Id
				WHERE	P.Mobile = @PatientMobile and DCS.ChannelingStatus is not null
				
		END

		ELSE
		BEGIN
			IF @UserTypeId = 1
				SELECT	Id, Number, PatientId, SessionId, Status,  Description
				FROM	Appointments 
				WHERE	IsDeleted = 0
			ELSE
				SELECT	A.Id, A.Number, A.PatientId, A.SessionId, A.Status,  A.Description
				FROM	Appointments A
							INNER JOIN @AllowedSessions AlS ON A.SessionId = AlS.Id
				WHERE	A.IsDeleted = 0
		END

	 
			
		
		


	END TRY
	BEGIN CATCH
		
		DECLARE @ErrorMessage NVARCHAR(4000)
		DECLARE @ErrorSeverity INT
		DECLARE @ErrorState INT

		SELECT @ErrorMessage = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE()

		RAISERROR (@ErrorMessage,@ErrorSeverity,@ErrorState)
		
	END CATCH
END
-- EXEC AppointmentGet @UserId=18037,@PatientId=20193
GO


 * 
 */

// added new table by lasith on 11th december 2023
// currently on 
// clinic
// ...
// CREATE TABLE [dbo].[AccountDeleteRequest] (
//     [Id]     INT            IDENTITY (1, 1) NOT NULL,
//     [ProfileName]  NVARCHAR (100) NULL,
//     [EmailAddress] NVARCHAR (100) NULL,
//     [MobileNumber] NVARCHAR (50)  NULL,
//     CONSTRAINT [PK_AccountDeleteRequest] PRIMARY KEY CLUSTERED ([Id] ASC)
// );


//username availability check created on 31st dec by lasith ------------------------------------------

// SET ANSI_NULLS ON
// GO
// SET QUOTED_IDENTIFIER ON
// GO
// ALTER PROCEDURE [dbo].[UserNameAvailabilityGet]
//     @UserName NVARCHAR(40)
// AS
// BEGIN
//     BEGIN TRY
		
// 		SELECT CASE 
//             WHEN COUNT(Username) > 0 THEN 'not_available' 
//             ELSE 'available' 
//         END AS UsernameAvailability
//             From Users
//             WHERE Username = @UserName

// 	END TRY
// 	BEGIN CATCH
		
// 		DECLARE @ErrorMessage NVARCHAR(4000)
// 		DECLARE @ErrorSeverity INT
// 		DECLARE @ErrorState INT

// 		SELECT @ErrorMessage = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE()

// 		RAISERROR (@ErrorMessage,@ErrorSeverity,@ErrorState)
		
// 	END CATCH
// END
// GO
//username availability check created on 31st dec by lasith ------------------------------------------




// SET ANSI_NULLS ON
// GO
// SET QUOTED_IDENTIFIER ON
// GO
// ALTER PROCEDURE [dbo].[DoctorNotifyDetailsGet]
// 	@AppointmentId INT
// AS
// BEGIN
// 	BEGIN TRY
		
// 		SELECT 
//         CONCAT(P.Title,' ',P.FirstName,' ', P.LastName) AS PatientName,
//         CONCAT(D.Title,' ',D.FirstName,' ', D.LastName) AS DoctorName,
//         D.Email AS DoctorEmail,
//         S.TimeStart AS TimeStart,
//         S.TimeEnd AS TimeEnd,
//         A.Id AS AppointmentId,
//         A.Number AS AppointmentNumber
//         FROM Appointments A
//         LEFT OUTER JOIN Sessions S ON S.Id = A.SessionId
//         LEFT OUTER JOIN Doctors D ON S.DoctorId = D.Id
//         LEFT OUTER JOIN Patients P ON A.PatientId = P.Id
//         WHERE A.Id = @AppointmentId
		
// 	END TRY
// 	BEGIN CATCH
		
// 		DECLARE @ErrorMessage NVARCHAR(4000)
// 		DECLARE @ErrorSeverity INT
// 		DECLARE @ErrorState INT

// 		SELECT @ErrorMessage = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE()

// 		RAISERROR (@ErrorMessage,@ErrorSeverity,@ErrorState)

// 	END CATCH
// END
// GO
