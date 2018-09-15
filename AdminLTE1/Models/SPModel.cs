using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdminLTE1.Models
{
    public class Product
    {
        //产品编号
        public int Id { get; set; }
        //产品名称
        public string ProductName { get; set; }
        //产品描述
        public string Description { get; set; }
        //产品价格
        public decimal Price { get; set; }
    }
}
