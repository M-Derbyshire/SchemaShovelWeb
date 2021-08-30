package uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier.DatabaseEntityIdentifier;

class DatabaseEntityIdentifierUnitTests {

	static DatabaseEntityIdentifier identifier;
	
	@BeforeAll
	public static void init()
	{
		identifier = new DatabaseEntityIdentifier();
	}
	
	@Test
	void isValidTablePathWillCorrectlyDetermineIfTheGivenPathIsCorrect()
	{
		String[] correctPaths = { "schema.table", "s1.t1", "ahjasdh.djashjdh" };
		String[] incorrectPaths = { "schema", "s1.t1.c1", "ahsdhadhjsdhkjahd" };
		
		for(String correctPath : correctPaths)
		{
			assertThat(identifier.isValidTablePath(correctPath)).isTrue();
		}
		
		for(String incorrectPath : incorrectPaths)
		{
			assertThat(identifier.isValidTablePath(incorrectPath)).isFalse();
		}
	}

}
