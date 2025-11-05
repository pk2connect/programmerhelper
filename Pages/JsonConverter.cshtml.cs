using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CompareTextFile.Pages
{
    public class JsonConverterModel : PageModel
    {
        public string? InputText { get; set; }
        public string? OutputText { get; set; }

        public void OnGet()
        {
        }
    }
}