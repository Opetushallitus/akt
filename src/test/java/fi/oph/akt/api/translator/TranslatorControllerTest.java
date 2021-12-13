package fi.oph.akt.api.translator;

import fi.oph.akt.service.PublicTranslatorService;
import java.util.List;
import javax.annotation.Resource;
import net.minidev.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TranslatorController.class)
class TranslatorControllerTest {

	@Resource
	private MockMvc mockMvc;

	@MockBean
	private PublicTranslatorService publicTranslatorService;

	@Test
	public void testValidContactRequest() throws Exception {
		final JSONObject data = validContactRequestData();

		postContactRequest(data).andExpect(status().isCreated());
	}

	@Test
	public void testValidContactRequestWithoutPhoneNumber() throws Exception {
		final JSONObject data = validContactRequestData();
		data.remove("phoneNumber");

		postContactRequest(data).andExpect(status().isCreated());
	}

	@Test
	public void testContactRequestWithEmptyData() throws Exception {
		final JSONObject data = new JSONObject();

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithEmptyFirstName() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("firstName", "");

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithTooLongFirstName() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("firstName",
				"WaxVbJSntexphcbtspCbeMKXzPmUXfCRphxCLjqrRvZEhVUrfAySyQdfcejYVBqaPqbMzRvzGwpAPyehsaLznJuYHXTZfWVsDmkYttYFanBLTjFsNKvuMrYyffneqUPfnkxfbFrpzkPTqWnMrcDLUVjynzztpbKxmgAcHLYewFBFHtcBeaHuJqHcJbrvxGvNWABqFxfdhMdBGFHEtqmGtYmQCfmSvChtxHHcbCVvDbRJtjqTKqrTVLxdSdYhvFnF");

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithEmptyLastName() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("lastName", "");

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithTooLongLastName() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("lastName",
				"NzfRbZruLuzCEXcusXfJWrCxGpnjtwALPyyxdzftnnghQnemgAQxSyzAYytzKydPWfLsrMpFHLhLrNsnKavCpWmMqpPaWBzXKCtZFgQgeBSVBnjrRgRbVdTbzJMaLfANqMJerFsDCMXqQXMZSBueuepcndGhspMYcGDtPpdynZvKdXsxJXgWektZpGqBvpFwPGHkHCpgaddCrfRxzSVrMdEPPfzPrndSkfuHrBzCgePFxFVwjzaSgBzySwqCvyAv");

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithInvalidEmail() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("email", "foo2bar");

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithTooLongPhoneNumber() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("phoneNumber",
				"6426964339863655628753222276825267943468538864682295278496996689949538473539347967484559387922889756692769924433976993273939225377669572974465346992344578543452378338256936373278886975557744296638849349759328262554939624782784889998562886446766259696848979");

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithEmptyMessage() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("message", "");

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithTooLongMessage() throws Exception {
		final JSONObject data = validContactRequestData();
		final String message = """
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo sapien quis nulla placerat ullamcorper. Etiam et vulputate tellus. Nullam eget semper eros, non aliquam mi. Quisque a ex fermentum ipsum tincidunt interdum vel ac enim. Phasellus consectetur felis id lacinia tincidunt. Nam ullamcorper, mi sit amet dictum finibus, ligula ipsum pharetra justo, eget consectetur neque lacus ut quam. Ut dictum quam quis sagittis luctus. Integer at aliquam tellus, in ornare dui. Nullam tempor faucibus nisi at efficitur.

					Morbi viverra, leo pharetra vestibulum placerat, ex metus tempus odio, eu egestas lorem sem quis augue. Phasellus quis imperdiet enim, vitae euismod justo. Mauris pretium tincidunt nisl, ac iaculis mi rutrum nec. Quisque sed enim vehicula, commodo tellus non, porttitor arcu. Donec luctus, lorem sit amet viverra dignissim, odio massa feugiat odio, eu tincidunt ipsum quam non purus. Phasellus non purus eget lacus commodo dignissim quis semper massa. In eu placerat nunc. Cras vitae leo quis ex suscipit ultrices. Nunc pulvinar ante in lectus ultrices lobortis. Aenean magna urna, gravida sit amet tincidunt vitae, pharetra sit amet mi. Maecenas euismod justo eget est sollicitudin congue.

					Duis a lacinia sem. In eget mattis enim. Quisque id est justo. Morbi venenatis ut lacus id dictum. In elementum dictum ligula nec maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sollicitudin interdum sodales. Etiam cursus lorem vel metus molestie, a placerat nibh volutpat. Ut gravida tortor elit, sit amet gravida justo bibendum at. Nam accumsan pulvinar iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec condimentum sapien eros, id pulvinar metus viverra at. Aenean vitae arcu bibendum, interdum dolor ac, eleifend ex. Donec euismod lobortis vehicula.

					In non lectus non ligula lacinia malesuada ut ut lorem. Nunc suscipit mi vel varius finibus. Fusce eget vulputate felis, nec feugiat leo. Aliquam pharetra pharetra tincidunt. Duis elementum magna mi, id finibus velit ultricies vitae. Sed aliquet lorem vitae dui pretium facilisis. Fusce finibus id nisi nec accumsan. Sed venenatis enim ultrices risus tempus, nec mollis tortor tempus. Nulla facilisi. Aliquam accumsan sed dolor ac porttitor. Morbi eu nulla vitae dui ultricies posuere eu quis libero. Nunc molestie, quam pharetra iaculis tincidunt, mauris lorem volutpat orci, a elementum purus velit sed mi.

					Cras mollis tincidunt eros quis vestibulum. Morbi blandit viverra sapien, et imperdiet tellus egestas ac. Nam dignissim quis sapien in finibus. Nullam nisl dui, elementum ut purus sed, accumsan dignissim nibh. In feugiat feugiat diam eget hendrerit. Suspendisse at vehicula velit. Nullam fringilla ultrices bibendum. Aliquam luctus risus non felis elementum viverra. Vivamus volutpat mauris cursus facilisis scelerisque. Quisque ac tortor interdum, suscipit sem id, vestibulum nulla.

					Donec ac erat lorem. Nulla eu interdum mi. Quisque ac nisi sit amet quam iaculis accumsan. Nulla ornare ut nisl vel viverra. Morbi semper vehicula nunc quis volutpat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc vestibulum feugiat placerat. Maecenas sollicitudin risus vel massa sagittis, non accumsan felis auctor. Suspendisse sed enim nec enim luctus sodales. Donec lacinia auctor lorem, in fermentum massa condimentum ac. Suspendisse nisl eros, vehicula a efficitur sed, bibendum ac turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis viverra neque et leo lobortis vulputate.

					Quisque at diam eu erat consequat pretium quis sed orci. Ut eget tincidunt nisl, in faucibus arcu. Maecenas at efficitur massa. Praesent aliquam facilisis mi, ac congue neque posuere id. Nam gravida porttitor velit nec varius. Fusce et fermentum nisl. Vivamus mollis hendrerit pellentesque. Ut vehicula rhoncus nulla, quis tempus ante placerat in. Nulla sapien quam, egestas vulputate viverra eget, accumsan quis risus. Aliquam faucibus, ante in tempor euismod, quam felis aliquet tortor, ac molestie arcu massa vel lectus. Morbi et turpis et tellus ultricies ultricies. Suspendisse potenti.

					Pellentesque ornare justo ac posuere porta. Sed nec augue tortor. Duis in rutrum dolor. Morbi ultricies semper sapien, ac accumsan elit suscipit at. In sed blandit elit. Integer vel urna sagittis, tincidunt sem in, iaculis sapien. Quisque mattis scelerisque ipsum id volutpat. Nullam accumsan, lectus et volutpat fermentum, turpis nunc tincidunt sapien, ac fringilla urna enim non odio. In accumsan commodo nisl eu convallis. Vivamus elementum diam nec mauris rutrum ornare. Aenean a orci ultrices, placerat nisl hendrerit, porttitor nunc.

					Proin volutpat elit ut mauris placerat volutpat. Phasellus in congue leo, a imperdiet risus. Nullam iaculis diam mi, vel consequat nulla tempus eleifend. Donec quis erat nulla. Nulla tristique, mauris eget iaculis auctor, diam mauris tincidunt sapien, id vulputate arcu arcu vehicula ex. Proin vestibulum tellus ac arcu euismod, sed gravida justo gravida. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;

					Vestibulum quis massa arcu. Integer interdum semper vulputate. Suspendisse lobortis dignissim dolor, ut hendrerit ante pellentesque eget. Praesent id metus elit. Maecenas ut dui ut erat mattis porta at nec justo. Vivamus pretium fringilla aliquam. In facilisis justo vitae mi convallis sagittis. Mauris placerat vitae nunc a blandit. Vestibulum a massa nisi. Nulla malesuada magna a lectus pretium dapibus.

					Nunc laoreet sapien pellentesque sapien lobortis finibus. Nam convallis egestas nisl id consectetur. Proin ultricies vulputate tortor eget consectetur. Ut eget sagittis neque. Nullam malesuada urna eros, vitae varius tortor lacinia vitae. Mauris egestas posuere metus, at ultricies mi cursus et. Nulla non ligula sem. Quisque sagittis velit et placerat maximus. Phasellus at suscipit nibh, nec tristique leo.
				""";
		data.put("message", message);

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithNoTranslatorIds() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("translatorIds", List.of());

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithInvalidTranslatorIds() throws Exception {
		final JSONObject data = validContactRequestData();
		data.put("translatorIds", List.of("a", "b"));

		postContactRequest(data).andExpect(status().isBadRequest());
	}

	private JSONObject validContactRequestData() {
		final JSONObject data = new JSONObject();
		data.put("firstName", "Foo");
		data.put("lastName", "Bar");
		data.put("email", "foo@bar");
		data.put("phoneNumber", "0409876543");
		data.put("message", "Lorem ipsum dolor sit amet");
		data.put("translatorIds", List.of(56, 4));

		return data;
	}

	private ResultActions postContactRequest(JSONObject data) throws Exception {
		return mockMvc.perform(post("/api/v1/translator/contact-request").contentType(MediaType.APPLICATION_JSON)
				.content(data.toJSONString()).with(csrf()));
	}

}
