 namespace Terrasoft.Configuration.UsrCustomNamespace
{
    using System;
    using System.ServiceModel;
    using System.ServiceModel.Activation;
    using System.ServiceModel.Web;
    using Terrasoft.Common;
    using Terrasoft.Core;
    using Terrasoft.Core.Entities;
    using Terrasoft.Web.Common;
    using Terrasoft.Configuration;
    using Terrasoft.Web.Http.Abstractions;
    using Terrasoft.Core.DB;
    using System.Collections.Generic;
    using Newtonsoft.Json;
    using System.Data;

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class UsrCustomConfigurationService: BaseService
    {
        //Идентификатор статуса выпуска со значением "Завершённый"
        public readonly string ID_STATUS_COMPLETED_ISSUE = "af3fece2-b615-467d-a0f0-611fbf0a27a2";

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
       ResponseFormat = WebMessageFormat.Json)]
        
        // Способ первый через фильтры.
        public decimal GetSumCostCompletedIssues(string usrCode){

            if (usrCode.IsEmpty())
            {
                return -1;
            }

            decimal resultSum = 0;
            
            var esqAdUnits = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrAdUnits");

            var colNameAdUnitId = esqAdUnits.AddColumn("Id").Name;
            esqAdUnits.AddColumn("UsrCode");

            var esqFilterByCode = esqAdUnits.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrCode", usrCode);
            esqAdUnits.Filters.Add(esqFilterByCode);

            var entities = esqAdUnits.GetEntityCollection(UserConnection);

            if (entities.Count > 0)
            {
                foreach (var item in entities)
                {
                    resultSum += getSumCompletedIssues(item.GetTypedColumnValue<Guid>(colNameAdUnitId));
                }
            }
            else
            {
                return -1;
            }

            return resultSum;
		}

        private decimal getSumCompletedIssues(Guid adUnitId)
        {
            decimal resultSum = 0;

            //Получаю коллекцию завершённых выпусков, относящиеся к определённому разделу adUnitId, потом суммирую их.
            var collectionIssues = getComplitedIssues(adUnitId);

            foreach(var item in collectionIssues)
            {
                resultSum += item.GetTypedColumnValue<decimal>("UsrCost");
            }

            return resultSum;
        }

        private EntityCollection getComplitedIssues(Guid adUnitId)
        {
            Guid idStatusCompletedIssue = new Guid(ID_STATUS_COMPLETED_ISSUE);

            var esqIssue = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrIssues");

            esqIssue.AddColumn("UsrCost");

            var esqFilterAdUnits = esqIssue.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrUsrAdUnits", adUnitId);
            var esqFilterCost = esqIssue.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrStatusIssue", idStatusCompletedIssue);

            esqIssue.Filters.Add(esqFilterAdUnits);
            esqIssue.Filters.Add(esqFilterCost);

            return esqIssue.GetEntityCollection(UserConnection);
        }

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
       ResponseFormat = WebMessageFormat.Json)]

        // Способ второй
        public decimal GetAmountCostComplitedIssues(string idAdUnit)
        {
            decimal result = 0;

            if (!ExistenceAdUnit(idAdUnit))
            {
                return -1;
            }

            var select = new Select(UserConnection)
                .Sum("UsrCost").As("SumComplitedIssues")
                .From("UsrIssues")
                .Join(JoinType.Inner, "UsrAdUnits").On("UsrAdUnits", "Id").IsEqual("UsrIssues", "UsrUsrAdUnitsId")
                .Where("UsrAdUnits", "UsrCode").IsEqual(Column.Parameter(idAdUnit))
                    .And("UsrStatusIssueId").IsEqual(Column.Parameter(ID_STATUS_COMPLETED_ISSUE))
                as Select;

            select.ExecuteReader(dataReader =>
            {
                result = dataReader.GetColumnValue<decimal>("SumComplitedIssues");
            });

            return result;
        }

        private bool ExistenceAdUnit(string idAdUnit)
        {
            if (idAdUnit.IsEmpty())
            {
                return false;
            }

            var select = new Select(UserConnection)
                .Count("UsrName").As("RecordsCount")
                .From("UsrAdUnits")
                .Where("UsrAdUnits", "Id").IsEqual(Column.Parameter(idAdUnit))
                as Select;

            int result = 0;

            select.ExecuteReader(dataReader =>
            {
                result = dataReader.GetColumnValue<int>("RecordsCount");
            });

            return result > 0;
        }

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
       ResponseFormat = WebMessageFormat.Json)]

        // Метод вывода информации о выпуске по его имени
        // Если UsrName оставлен пустым, то выводятся все выпуски
        public string GetInfoAboutIssues(string usrName)
        {
            var result = "{}";
            var select = new Select(UserConnection);

            if (usrName.IsEmpty())
            {
                select = GetAllIssues();
            }
            else
            {
                select = GetAllIssues().
                    Where("UsrIssues", "UsrName").IsEqual(Column.Parameter(usrName))
                as Select;
            }

            using (DBExecutor dbExecutor = UserConnection.EnsureDBConnection())
            {
                using (IDataReader dataReader = select.ExecuteReader(dbExecutor))
                {
                    result = CreateJson(dataReader);
                }
            }
            return result;
        }

        private Select GetAllIssues()
        {
            var select = new Select(UserConnection)
                .Column("UsrIssues", "UsrName").As("NameIssue")
                .Column("UsrAdUnits", "UsrName").As("NameAdUnit")
                .Column("UsrIssues", "UsrDateIssues").As("DateIssue")
                .Column("UsrIssues", "UsrPresenter").As("PresenterIssue")
                .Column("UsrIssues", "UsrDurationIssues").As("DurationIssue")
                .Column("UsrDStatusIssue", "Name").As("NameStatusIssue")
                .Column("UsrIssues", "UsrCost").As("CostIssue")
                .From("UsrIssues")
                .InnerJoin("UsrAdUnits").On("UsrAdUnits", "Id").IsEqual("UsrIssues", "UsrUsrAdUnitsId")
                .InnerJoin("UsrDStatusIssue").On("UsrDStatusIssue", "Id").IsEqual("UsrIssues", "UsrStatusIssueId")
                as Select;

            return select;
        }

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
       ResponseFormat = WebMessageFormat.Json)]

        // Метод изменения статуса выпуска по его дате.

        public string UpdateStatusIssues(string issueForChange, string nameNewStatusIssue)
        {
            Guid issueForChangeGuid = new Guid(issueForChange);
            Guid nameNewStatusIssueGuid = new Guid(nameNewStatusIssue);

            var update = new Update(UserConnection, "UsrIssues")
                .Set("UsrStatusIssueId", Column.Parameter(nameNewStatusIssueGuid))
                .Where("UsrIssues", "Id").IsEqual(Column.Parameter(issueForChangeGuid))
                .And("UsrIssues", "UsrStatusIssueId").IsNotEqual(Column.Parameter(nameNewStatusIssueGuid));
            var cnt = update.Execute();
            return $"Значение статуса выпуска с Id {issueForChange} изменено на {nameNewStatusIssue}. Затронуто :{cnt} строчек ";
        }

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
       ResponseFormat = WebMessageFormat.Json)]

        public string AddNewIssue(string idAdUnit, string idStatusIssue, string nameIssue, string namePresenter, int costIssue = 0, int durationIssue = 0)
        {
            nameIssue = (nameIssue == "") ? "!!!Пусто!!!" : nameIssue;
            namePresenter = (namePresenter == "") ? "!!!Пусто!!!" : namePresenter;

            if (idAdUnit.IsEmpty())
            {
                return "Вы не ввели Id рекламного блока";
            }
            if (idStatusIssue.IsEmpty())
            {
                return "Вы не ввели Id справочника!";
            }

            Guid idAdUnitGuid = new Guid(idAdUnit);
            Guid idStatusIssueGuid = new Guid(idStatusIssue);

            DateTime dateIssueDateTime = DateTime.Now.Subtract(new TimeSpan(3, 0, 0));
            string dateIssue = dateIssueDateTime.ToString("yyyy-MM-dd HH:mm:ss");

            var ins = new Insert(UserConnection)
                .Into("UsrIssues")
                .Set("UsrName", Column.Parameter(nameIssue))
                .Set("UsrUsrAdUnitsId", Column.Parameter(idAdUnitGuid))
                .Set("UsrDateIssues", Column.Parameter(dateIssue))
                .Set("UsrPresenter", Column.Parameter(namePresenter))
                .Set("UsrDurationIssues", Column.Parameter(durationIssue))
                .Set("UsrStatusIssueId", Column.Parameter(idStatusIssueGuid))
                .Set("UsrCost", Column.Parameter(costIssue));
            var affectedRows = ins.Execute();

            return $"Добавлен новый выпуск '{nameIssue}' с датой {dateIssue}. " +
                $"Выступающий {namePresenter}, длительность {durationIssue}, стоимость {costIssue}. " +
                $"Добавлено строк: {affectedRows}";
        }

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
      ResponseFormat = WebMessageFormat.Json)]

        public string DeleteIssue(string idIssue)
        {
            var delete = new Delete(UserConnection)
                .From("UsrIssues")
                .Where("UsrIssues", "Id").IsEqual(Column.Parameter(idIssue));
            var cnt = delete.Execute();
            return $"Выпуск с Id = {idIssue} был удалён. Затронуто записей: {cnt}";
        }

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
      ResponseFormat = WebMessageFormat.Json)]

        public string DeleteAllLowCostIssue(string lowCost)
        {
            var delete = new Delete(UserConnection)
                .From("UsrIssues")
                .Where("UsrIssues", "UsrCost").IsLessOrEqual(Column.Parameter(lowCost));
            var cnt = delete.Execute();
            return $"Выпуски стоимостью <= {lowCost} были удалены. Затронуто записей: {cnt}";
        }
        
        private string CreateJson(IDataReader dataReader)
        {
            var list = new List<dynamic>();
            var cnt = dataReader.FieldCount;
            var fields = new List<string>();
            for (int i = 0; i < cnt; i++)
            {
                fields.Add(dataReader.GetName(i));
            }
            while (dataReader.Read())
            {
                dynamic exo = new System.Dynamic.ExpandoObject();
                foreach (var field in fields)
                {
                    ((IDictionary<String, Object>)exo).Add(field, dataReader.GetColumnValue(field));
                }
                list.Add(exo);
            }
            return JsonConvert.SerializeObject(list);
        }
    }
}
