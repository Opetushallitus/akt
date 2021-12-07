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
		final JSONObject data = new JSONObject();
		data.put("email", "foo@bar");
		data.put("phoneNumber", "0409876543");
		data.put("translatorIds", List.of(56, 4));
		mockMvc.perform(post("/api/v1/translator/contact-request").contentType(MediaType.APPLICATION_JSON)
				.content(data.toJSONString()).with(csrf())).andExpect(status().isCreated());
	}

	@Test
	public void testValidContactRequestWithoutPhone() throws Exception {
		final JSONObject data = new JSONObject();
		data.put("email", "foo@bar");
		data.put("translatorIds", List.of(4));

		mockMvc.perform(post("/api/v1/translator/contact-request").contentType(MediaType.APPLICATION_JSON)
				.content(data.toJSONString()).with(csrf())).andExpect(status().isCreated());
	}

	@Test
	public void testContactRequestWithNoTranslatorIds() throws Exception {
		final JSONObject data = new JSONObject();
		data.put("email", "foo@bar");
		data.put("phoneNumber", "0409876543");
		data.put("translatorIds", List.of());

		mockMvc.perform(post("/api/v1/translator/contact-request").contentType(MediaType.APPLICATION_JSON)
				.content(data.toJSONString()).with(csrf())).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithoutEmail() throws Exception {
		final JSONObject data = new JSONObject();
		data.put("phoneNumber", "0409876543");
		data.put("translatorIds", List.of(4));

		mockMvc.perform(post("/api/v1/translator/contact-request").contentType(MediaType.APPLICATION_JSON)
				.content(data.toJSONString()).with(csrf())).andExpect(status().isBadRequest());
	}

	@Test
	public void testContactRequestWithInvalidEmail() throws Exception {
		final JSONObject data = new JSONObject();
		data.put("email", "foo2bar");
		data.put("phoneNumber", "0409876543");
		data.put("translatorIds", List.of(4));

		mockMvc.perform(post("/api/v1/translator/contact-request").contentType(MediaType.APPLICATION_JSON)
				.content(data.toJSONString()).with(csrf())).andExpect(status().isBadRequest());
	}

}